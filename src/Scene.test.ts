import * as tape from "tape";
import { Component, Entity, Plugin, Scene } from ".";
import { IJSONObject } from "@aicacia/json";
import { globalJSONClassRegistry } from "./JSONClassRegistry";

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

  fromJSON(json: IJSONObject) {
    this.position = json.position as number;
    this.globalPosition = json.globalPosition as number;
    return this;
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
      .addChild(
        new Entity().addTag("child").addComponent(new Test()),
        new Entity().addTag("child2").addComponent(new Test())
      )
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

  assert.true(scene.findWithTag("child2").isSome());

  assert.end();
});

tape("Scene to/from JSON", (assert: tape.Test) => {
  const scene = new Scene()
    .addEntity(
      new Entity()
        .addTag("parent")
        .addComponent(new Test())
        .addChild(
          new Entity().addTag("child").addComponent(new Test()),
          new Entity().addTag("child").addComponent(new Test())
        )
    )
    .addPlugin(new Test1Plugin(), new Test2Plugin());

  scene.maintain();

  const json = scene.toJSON();

  scene.clear();
  scene.maintain();

  const TestTypeId = globalJSONClassRegistry.getByConstructor(Test);
  const Test1PluginTypeId = globalJSONClassRegistry.getByConstructor(
    Test1Plugin
  );
  const Test2PluginTypeId = globalJSONClassRegistry.getByConstructor(
    Test2Plugin
  );

  assert.deepEqual(json, {
    name: "",
    entities: [
      {
        name: "",
        tags: ["parent"],
        children: [
          {
            name: "",
            tags: ["child"],
            children: [],
            components: [
              { typeId: TestTypeId, position: 0, globalPosition: 0 },
            ],
          },
          {
            name: "",
            tags: ["child"],
            children: [],
            components: [
              { typeId: TestTypeId, position: 0, globalPosition: 0 },
            ],
          },
        ],
        components: [{ typeId: TestTypeId, position: 0, globalPosition: 0 }],
      },
    ],
    plugins: [{ typeId: Test1PluginTypeId }, { typeId: Test2PluginTypeId }],
  });

  scene.fromJSON(json);

  assert.equals(scene.findAllWithTag("child").length, 2);
  assert.equals(
    scene.findWithTag("child").unwrap().getRequiredComponent(Test).position,
    0
  );

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
