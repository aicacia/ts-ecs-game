import { Component, Manager, Plugin } from "../../lib";

export class TestManager extends Manager {
  static managerName = "TestManager";
}

export class Test extends Component {
  static Manager = TestManager;
  static componentName = "Test";

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

export class TestPlugin extends Plugin {
  static pluginName = "TestPlugin";
}
