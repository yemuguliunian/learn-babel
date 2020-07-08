# learn-babel

记录如何实现 `babel` 插件，属于试验项目，个人练习的 `babel` 插件存放在 `plugins` 目录下。

统计一些实用的`babel`插件，记录在根目录`awesome-babel.md`文件中。

## 参考

-   [Babel 文档](https://www.babeljs.cn/docs)
-   [插件开发](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)

**AST 在线转换工具**

https://astexplorer.net/

## 使用

```shell
yarn install

# test
yarn babel
```

目前主要简单实现了两个插件

-   去除 `console` 打印
-   `taro-ui` `import`编译

**remove-console.test.js**

```js
console.log('test');

function test() {
    console.warn('warn');
    console.log('test');
}

const obj = {
    a: '1',
    b: '2',
    test() {
        console.log('test');
    },
};
```

编译后

```js
function test() {
    console.warn('warn');
}

const obj = {
    a: '1',
    b: '2',

    test() {},
};
```

**taro-ui.test.js**

```js
import { AtModal, AtModalContent } from 'taro-ui';
```

编译后

```js
import { AtModal, AtModalContent } from 'taro-ui';

require('taro-ui/dist/style/components/modal.scss');
```

## \*插件顺序

> 插件的排列顺序很重要。

这意味着如果两个转换插件都将处理“程序（Program）”的某个代码片段，则将根据转换插件或 preset 的排列顺序依次执行。

-   插件在 Presets 前运行。
-   插件顺序从前往后排列。
-   Preset 顺序是颠倒的（从后往前）。
