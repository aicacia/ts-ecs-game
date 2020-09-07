import * as tape from "tape";
import { Component, Entity, Plugin, Scene } from ".";

export class Test extends Component {
  position = 0;
  globalPosition = 0;

  onUpdate() {
    this.position += 1;

    this.getEntity()
      .flatMap((entity) =>
        entity.getParent().flatMap((parent) => parent.getComponent(Test))
      )
      .mapOrElse(
        (parentComponent) => {
          this.globalPosition = parentComponent.position + this.position;
        },
        () => {
          this.globalPosition = this.position;
        }
      );

    return this;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      position: this.position,
      globalPosition: this.globalPosition,
    };
  }
}

export class Test1Plugin extends Plugin {
  static pluginPriority = 1;
}

export class Test2Plugin extends Plugin {
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

  const parent = scene
    .findWithTag("parent")
    .expect("failed to find entity with tag 'parent'");
  assert.true(parent.isRoot());
  assert.equal(parent.getDepth(), 0);
  assert.deepEqual(parent.getTags(), new Set(["parent"]));

  const child = scene
    .findWithTag("child")
    .expect("failed to find entity with tag 'child'");
  assert.false(child.isRoot());
  assert.equal(child.getDepth(), 1);
  assert.deepEqual(child.getTags(), new Set(["child"]));

  child.detach();

  assert.true(child.isRoot());
  assert.equal(child.getDepth(), 0);

  assert.end();
});

tape("Scene to/from JSON", (assert: tape.Test) => {
  const scene = new Scene().addEntity(
    new Entity()
      .addTag("parent")
      .addComponent(new Test())
      .addChild(new Entity().addTag("child").addComponent(new Test()))
  );

  scene.maintain();

  const json = scene.toJSON();

  scene.clear();
  scene.maintain();

  assert.deepEqual(json, {
    name: "",
    entities: [
      {
        name: "",
        depth: 0,
        tags: ["parent"],
        children: [
          {
            name: "",
            depth: 1,
            tags: ["child"],
            children: [],
            components: [{ type: "Test", position: 0, globalPosition: 0 }],
          },
        ],
        components: [{ type: "Test", position: 0, globalPosition: 0 }],
      },
    ],
  });

  assert.end();
});

tape("Scene find(All)", (assert: tape.Test) => {
  const scene = new Scene().addEntity(
    new Entity()
      .addTag("parent")
      .addChild(new Entity().addTag("child"), new Entity().addTag("child"))
  );

  scene.maintain();

  assert.equals(scene.findAllWithTag("parent").length, 1);
  assert.equals(scene.findAllWithTag("child").length, 2);

  assert.end();
});
