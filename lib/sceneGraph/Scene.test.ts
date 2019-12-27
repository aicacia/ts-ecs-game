import * as tape from "tape";
import { Component, Entity, Manager, Plugin, Scene } from "..";

export class TestManager extends Manager {
  static managerName = "test.TestManager";
}

export class Test extends Component {
  static Manager = TestManager;
  static componentName = "test.Test";

  position: number = 0;
  globalPosition: number = 0;

  onUpdate() {
    this.position += 1;

    this.getEntity()
      .flatMap(entity =>
        entity.getParent().flatMap(parent => parent.getComponent(Test))
      )
      .mapOrElse(
        parentComponent => {
          this.globalPosition = parentComponent.position + this.position;
        },
        () => {
          this.globalPosition = this.position;
        }
      );

    return this;
  }
}

export class Test1Plugin extends Plugin {
  static pluginName = "test.TestPlugin";
  static pluginPriority = 1;
}

export class Test2Plugin extends Plugin {
  static pluginName = "test.TestPlugin";
  static pluginPriority = Infinity;
}

tape("Scene", (assert: tape.Test) => {
  const scene = new Scene().addEntity(
    new Entity()
      .addTag("parent")
      .addComponent(new Test())
      .addChild(new Entity().addTag("child").addComponent(new Test()))
  );

  const test1Plugin = new Test1Plugin(),
    test2Plugin = new Test2Plugin();

  scene.addPlugin(test2Plugin, test1Plugin);
  assert.deepEquals(scene.getPlugins(), [test1Plugin, test2Plugin]);

  scene.update();

  const parent = scene.find(entity => entity.hasTag("parent")).unwrap();
  assert.true(parent.isRoot());
  assert.equal(parent.getDepth(), 0);
  assert.deepEqual(parent.getTags(), ["parent"]);

  const child = scene.find(entity => entity.hasTag("child")).unwrap();
  assert.false(child.isRoot());
  assert.equal(child.getDepth(), 1);
  assert.deepEqual(child.getTags(), ["child"]);

  child.detach();
  scene.maintain();

  assert.true(child.isRoot());
  assert.equal(child.getDepth(), 0);

  assert.end();
});