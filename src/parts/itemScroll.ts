import { MyObject3D } from "../webgl/myObject3D";
import { Mesh } from 'three/src/objects/Mesh';
import { Util } from "../libs/util";
import { DoubleSide } from 'three/src/constants';
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial';
import { SphereGeometry } from 'three/src/geometries/SphereGeometry';
import { Conf } from "../core/conf";

export class itemScroll extends MyObject3D {

  private _mesh:Mesh;

  constructor() {
    super()

    const geo = new SphereGeometry(0.5, 32, 32);
    this._mesh = new Mesh(
      geo,
      new MeshBasicMaterial({
        color: Util.instance.randomArr(Conf.instance.COLOR),
        transparent:true,
        side:DoubleSide,
        depthTest:true,
      })
    );
    this.add(this._mesh);
  }


  public setSize(size:number):void {
    this.scale.set(size, size, size);
  }


  protected _update():void {
    super._update();
  }


  protected _resize(): void {
    super._resize();
  }
}