/* eslint-disable no-console */
import {defineConfig, loadEnv, createLogger} from 'vite'
import dns from 'dns'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import vueJsx from '@vitejs/plugin-vue-jsx'
import {visualizer} from 'rollup-plugin-visualizer'

const path = require('path')

function mutateCookieAttributes(proxy) {
  proxy.on('proxyRes', function(proxyRes, req, res) {
    if (proxyRes.headers['set-cookie']) {
      proxyRes.headers['set-cookie'] = (proxyRes.headers['set-cookie']).map(h => {
        return h.replace(/Domain=.*;/, 'Domain=localhost; Secure;')
      })
    }
  })
}

function setHostHeader(proxy) {
  // TODO: stay the same
  const host = new URL(process.env.VITE_PORTAL_API_URL).hostname

  proxy.on('proxyReq', function(proxyRes) {
    proxyRes.setHeader('host', host)
  })
}

/**
 * Create a custom logger to ignore `vite:css` errors (from postcss) for imported packages
 */
function createCustomLogger() {
  const logger = createLogger()
  const loggerWarn = logger.warn
  // Create array of partial message strings to ignore
  const ignoredWarnings = [
    'end value has mixed support'
  ]

  logger.warn = (msg, options) => {
    // if the msg includes `vite:css` and one of the `ignoredWarnings`, ignore and do not log
    if (msg.includes('vite:css') && ignoredWarnings.some((partialMsg) => msg.includes(partialMsg))) return
    loggerWarn(msg, options)
  }

  return logger
}

export default ({command, mode}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())}

  // Include the rollup-plugin-visualizer if the BUILD_VISUALIZER env var is set to "true"
  const buildVisualizerPlugin = process.env.BUILD_VISUALIZER === 'true' && visualizer({
    filename: path.resolve(__dirname, 'bundle-analyzer/stats-treemap.html'),
    template: 'treemap', // sunburst|treemap|network
    sourcemap: true,
    gzipSize: true
  })

  console.log('command', command)

  // Sets VITE_INDEX_API_URL which is templated in index.html if BUILD_AND_SERVE=true
  process.env.VITE_INDEX_API_URL = process.env.PREVIEW_LOCAL === 'true' ? '/' : process.env.VITE_PORTAL_API_URL

  // Defaults locale to en
  process.env.VITE_LOCALE = process.env.VITE_LOCALE || 'en'

  // TODO: stay the same
  let portalApiUrl = process.env.VITE_PORTAL_API_URL
  if (!portalApiUrl.endsWith('/')) {
    portalApiUrl += '/'
  }

  const subdomainR = new RegExp(/http:\/\/(.*)localhost/)
  if (subdomainR.test(portalApiUrl)) {
    portalApiUrl = 'http://localhost' + portalApiUrl.replace(subdomainR, '')
  }

  // required to prevent localhost from being rendered as 127.0.0.1
  dns.setDefaultResultOrder('verbatim')

  return defineConfig({
    logLevel: 'info',
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router'],
            kongponents: ['@kong/kongponents'],
            kongAuthelements: ['@kong/kong-auth-elements'],
            specRenderer: ['@kong-ui-public/spec-renderer']
          }
        },
        plugins: [
          buildVisualizerPlugin
        ]
      }
    },
    plugins: [
      vue(
        {
          template: {
            transformAssetUrls: {
              includeAbsolute: false
            }
          }
        }
      ),
      vueJsx(),
      svgLoader()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      preserveSymlinks: true,
      /**
       * List of file extensions to try for imports that omit extensions. Note it is NOT recommended to omit extensions for custom import types (e.g. .vue) since it can interfere with IDE and type support.
       * TODO: This is a crutch as we need to add `.vue` to all component imports.
       * https://vitejs.dev/config/#resolve-extensions
       */
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    preview: {
      proxy: {
        '^/api': {
          target: portalApiUrl,
          changeOrigin: true,
          configure: (proxy, options) => {
            mutateCookieAttributes(proxy)
            setHostHeader(proxy)

            proxy.on('proxyReq', function(proxyReq, req, res, options) {
              console.log(req.url)
            })
          }
        }
      },
      cors: {
        origin: ['localhost:4173']
      }
    },
    server: {
      proxy: {
        '^/api': {
          target: portalApiUrl,
          changeOrigin: true,
          configure: (proxy, options) => {
            mutateCookieAttributes(proxy)
            setHostHeader(proxy)
          }
        }
      }
    },
    customLogger: createCustomLogger()
  })
}
