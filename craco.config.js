const path = require('path');

module.exports = {
  webpack: {
    alias: {
      types: path.resolve(__dirname, 'src/types'),
      'types/*': path.resolve(__dirname, 'src/types/*'),
      context: path.resolve(__dirname, 'src/context'),
      'context/*': path.resolve(__dirname, 'src/context/*'),
      models: path.resolve(__dirname, 'src/models'),
      'models/*': path.resolve(__dirname, 'src/models/*'),
      utils: path.resolve(__dirname, 'src/utils'),
      'utils/*': path.resolve(__dirname, 'src/utils/*'),
      store: path.resolve(__dirname, 'src/store'),
      'store/*': path.resolve(__dirname, 'src/store/*'),
      components: path.resolve(__dirname, 'src/components'),
      'components/*': path.resolve(__dirname, 'src/components/*'),
      containers: path.resolve(__dirname, 'src/containers'),
      'containers/*': path.resolve(__dirname, 'src/containers/*'),
    },
  },
};
