import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Update } from '../libs/update';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { EdgesGeometry } from 'three/src/geometries/EdgesGeometry';
import { Scroller } from "../core/scroller";
import { Tween } from "../core/tween";
import { Util } from "../libs/util";
import { Item } from "./item";
import { Color } from 'three/src/math/Color';
import { itemScroll } from './itemScroll';
import { Conf } from '../core/conf';
import { HSL } from '../libs/hsl';

export class Visual extends Canvas {

  private _con:Object3D;
  private _item:Array<Item> = [];
  private _scrollItem:itemScroll;
  private _bgColor:Color = new Color();

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    const col = Util.instance.randomArr(Conf.instance.COLOR).clone();
    const hsl = new HSL();
    col.getHSL(hsl);
    hsl.l *= 0.8;
    col.setHSL(hsl.h, hsl.s, hsl.l);
    this._bgColor = col;

    const geo = new PlaneGeometry(1,1);
    const edgeGeo = new EdgesGeometry(geo);

    for(let i = 0; i < 200; i++) {
      const item = new Item({
        geo:geo,
        edgeGeo:edgeGeo,
      });
      this._con.add(item);
      this._item.push(item);
    }

    // スクロールさせるやつ
    this._scrollItem = new itemScroll();
    this._con.add(this._scrollItem);

    this._con.rotation.x = Util.instance.radian(45);
    this._con.rotation.y = Util.instance.radian(-45);

    Scroller.instance.set(0);
    this._resize()
  }


  protected _update(): void {
    super._update()

    const sw = Func.instance.sw()
    const sh = Func.instance.sh()

    this._con.position.y = Func.instance.screenOffsetY() * -1

    const scroll = Scroller.instance.val.y;
    const scrollArea = sh * 2;

    Tween.instance.set(document.querySelector('.l-height'), {
      height:scrollArea
    })

    const moveDist = (sw / Math.cos(Util.instance.radian(45))) * 1.5;

    this._scrollItem.position.z = Util.instance.map(scroll, moveDist * 0.5, -moveDist * 0.5, 0, scrollArea - sh);

    const scrollItemSize = Math.min(sw, sh) * 0.2
    this._scrollItem.setSize(scrollItemSize);

    const test = this._scrollItem.position.z;
    this._item.forEach((val) => {
      const kake = 1;
      const v = ((val.position.z - test) * kake) * -1;
      val.setRadius(Util.instance.map(v, 0.425, 0, 0, scrollItemSize * 0.5))
    })

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(this._bgColor, 1)
    this.renderer.render(this.mainScene, this.cameraOrth)
  }


  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 1 == 0
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    const itemSize = Math.min(w, h) * 0.5;
    const interval = Func.instance.val(1.5, 3);
    const bigInterval = itemSize * 0.5;
    const d = 50;
    const total = this._item.length * interval + (bigInterval * ((this._item.length / d) - 1));

    // 一列バーっと
    let z = 0
    let baseCol:Color;
    this._item.forEach((val,i) => {
      if(i % d == 0) {
        baseCol = val.getColor();
      }

      val.position.z = z + total * 0.5;
      val.setSize(itemSize, itemSize);
      val.setEdgeColor(baseCol.clone());

      z += -interval
      if((i + 1) % d == 0) z += -bigInterval;
    })

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    if (isRender) {
      this._render();
    }
  }
}
