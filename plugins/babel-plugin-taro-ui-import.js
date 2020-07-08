const t = require('babel-types');
const template = require('babel-template');
const kebabCase = require('lodash/kebabCase');
const uniq = require('lodash/uniq');

const TAROUI_PACKAGE_NAME = 'taro-ui';

const buildRequire = template(`
  require(SOURCE);
`);

const SOURCE_MAP = {
    AtModalContent: 'modal',
};

module.exports = function ({ types }) {
    // plugin
    return {
        visitor: {
            ImportDeclaration(path, { opts }) {
                if (path.node.source.value !== TAROUI_PACKAGE_NAME) {
                    return;
                }
                const { specifiers } = path.node;

                const { sourceMap = {} } = opts;
                const mergedSourceMap = {
                    ...SOURCE_MAP,
                    ...sourceMap,
                };

                let sourceStrs = [];
                specifiers.map((specifier) => {
                    if (specifier.type === 'ImportDefaultSpecifier') {
                        return;
                    }
                    const { name } = specifier.imported;
                    if (mergedSourceMap[name]) {
                        const source = mergedSourceMap[name];
                        if (Array.isArray(source)) {
                            source.map((item) => {
                                sourceStrs.push(item);
                            });
                        } else {
                            sourceStrs.push(source);
                        }
                    } else {
                        const filename = kebabCase(name.replace('At', ''));
                        sourceStrs.push(filename);
                    }
                });

                uniq(sourceStrs)
                    .reverse()
                    .map((str) => {
                        path.insertAfter(
                            buildRequire({
                                SOURCE: t.stringLiteral(
                                    `${TAROUI_PACKAGE_NAME}/dist/style/components/${str}.scss`,
                                ),
                            }),
                        );
                    });
            },
        },
    };
};
