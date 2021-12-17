import React from 'react';
import {PluginClient, theme, usePlugin, createState, useValue, Layout} from 'flipper-plugin';
import { Button } from 'antd';

type UIComponentDef = {
  methodName: string;
  label: string;
  buttonStyle?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
};

type Events = {
  createButton: UIComponentDef;
};

export function plugin(client: PluginClient<Events, any>) {
  const uiComponents = createState<Record<string, UIComponentDef>>({}, {persist: 'uiComponents'});

  client.onMessage('createButton', (componentDef) => {
    uiComponents.update((draft) => {
      draft[componentDef.methodName] = componentDef;
    });
  });

  const sendMessage = (methodName: string) => {
    client.send(methodName, null)
  }

  return {uiComponents, sendMessage};
}

export function Component() {
  const instance = usePlugin(plugin);
  const components = useValue(instance.uiComponents);

  return (
    <Layout.ScrollContainer vertical style={{background: theme.backgroundWash}}>
      {Object.entries(components).map(([methodName, d]) => (
        <div style={{padding: 8}}>
          <Button type={d.buttonStyle || 'default'} onClick={() => {
            instance.sendMessage(methodName)
          }}>{d.label}</Button>
        </div>
      ))}
    </Layout.ScrollContainer>
  );
}
