import vt from '../glsl/base.vert';
import fg from '../glsl/item.frag';
import { MyObject3D } from "../webgl/myObject3D";
import { Mesh } from 'three/src/objects/Mesh';
import { Util } from "../libs/util";
import { DoubleSide } from 'three/src/constants';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { Conf } from '../core/conf';
import { Color } from 'three';


export class Item extends MyObject3D {

  private _mesh:Mesh;
  private _r:number = 0;
  private _col:Color;

  constructor(opt:any = {}) {
    super()

    this._col = Util.instance.randomArr(Conf.instance.COLOR).clone();

    this._mesh = new Mesh(
      opt.geo,
      new ShaderMaterial({
        vertexShader:vt,
        fragmentShader:fg,
        transparent:true,
        side:DoubleSide,
        uniforms:{
          color:{value:this._col},
          edgeColor:{value:this._col},
          rate:{value:0.45},
        }
      })
    );
    this.add(this._mesh);
  }


  public getColor():Color {
    return this._col;
  }


  public setEdgeColor(col:Color):void {
    this._getUni(this._mesh).edgeColor.value = col;
  }


  public setSize(w:number, h:number):void {
    this.scale.set(w, h, 1);
  }


  public setRadius(r:number):void {
    this._r += (r - this._r) * 0.2;
    this._getUni(this._mesh).rate.value = this._r;
  }


  protected _update():void {
    super._update();
  }


  protected _resize(): void {
    super._resize();
  }
}