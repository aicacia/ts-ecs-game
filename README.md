# ts-engine

engine

```ts
import { Component, Manager, Plugin } from "@aicacia/engine";

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
    this.getEntity().map(entity =>
      entity.getParent().map(parent =>
        parent.getComponent(Test).map(component => {
          this.globalPosition = component
            ? component.position + this.position
            : this.position;
        })
      )
    );

    return this;
  }
}

export class TestPlugin extends Plugin {
  static pluginName = "TestPlugin";
}
```
