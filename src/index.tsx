import React, { useState } from 'react';
import {
  PluginClient,
  theme,
  usePlugin,
  createState,
  useValue,
  Layout,
  useLocalStorageState,
} from 'flipper-plugin';
import { Button, Input, Typography } from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

type UIComponentDef = {
  methodName: string;
  label: string;
  buttonStyle?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  usePayload?: boolean;
  payloadPlaceholder?: string;
};

type Events = {
  createButton: UIComponentDef;
  removeButton: Pick<UIComponentDef, 'methodName'>;
};

export function plugin(client: PluginClient<Events, any>) {
  const uiComponents = createState<Record<string, UIComponentDef>>(
    {},
    { persist: 'uiComponents' },
  );

  client.onMessage('createButton', (componentDef) => {
    uiComponents.update((draft) => {
      draft[componentDef.methodName] = componentDef;
    });
  });

  client.onMessage('removeButton', (componentDef) => {
    uiComponents.update((draft) => {
      delete draft[componentDef.methodName];
    });
  });

  const sendMessage = (methodName: string, payload: any) => {
    client.send(methodName, payload !== undefined ? payload : {});
  };

  return { uiComponents, sendMessage };
}

interface ButtonAndPayloadPairProps {
  key: string;
  sendMessage: (methodName: string, payload: any) => void;
  methodName: string;
  d: UIComponentDef;
}

function ButtonAndPayloadPair({
  sendMessage,
  methodName,
  d,
}: ButtonAndPayloadPairProps) {
  const [payload, setPayload] = useLocalStorageState<string>(
    `arbitrary-buttons:${methodName}`,
    '',
  );
  const [error, setError] = useState<string | null>(null);

  return (
    <div style={{ padding: 8 }}>
      {d.usePayload && (
        <>
          <TextArea
            autoSize
            placeholder={
              d.payloadPlaceholder || `JSON payload for "${methodName}"`
            }
            onChange={(event) => {
              setPayload(event.target.value);
            }}
            value={payload}
          />
          {error && (
            <div>
              <Text type="danger">{error}</Text>
            </div>
          )}
        </>
      )}
      <Button
        type={d.buttonStyle || 'default'}
        onClick={() => {
          try {
            let parsedPayload = {};
            if (d.usePayload) {
              parsedPayload = JSON.parse(payload);
            }
            sendMessage(methodName, parsedPayload);
            setError(null);
          } catch (e) {
            if (e instanceof SyntaxError) {
              setError(e.message);
            } else {
              throw e;
            }
          }
        }}
      >
        {d.label}
      </Button>
    </div>
  );
}

export function Component() {
  const instance = usePlugin(plugin);
  const components = useValue(instance.uiComponents);

  return (
    <Layout.ScrollContainer
      vertical
      style={{ background: theme.backgroundWash }}
    >
      {Object.entries(components).map(([methodName, d]) => (
        <ButtonAndPayloadPair
          sendMessage={instance.sendMessage}
          methodName={methodName}
          d={d}
          key={methodName}
        />
      ))}
    </Layout.ScrollContainer>
  );
}
