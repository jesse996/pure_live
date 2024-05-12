// scripts/genAntdCss.tsx
import fs from "fs";
import { extractStyle } from "@ant-design/static-style-extract";
import { ConfigProvider } from "antd";

const outputPath = "./public/antd.min.css";

const testGreenColor = "#008000";
const testRedColor = "#ff0000";

const css = extractStyle((node) => (
  <>
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: testGreenColor,
        },
      }}
    >
      {node}
    </ConfigProvider>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: testGreenColor,
        },
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorBgBase: testRedColor,
          },
        }}
      >
        {node}
      </ConfigProvider>
    </ConfigProvider>
  </>
));

fs.writeFileSync(outputPath, css);
