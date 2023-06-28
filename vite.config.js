/* eslint-disable no-console */
import { defineConfig, loadEnv } from 'vite'
import fs from 'fs/promises'
import path from 'path'
import dns from 'dns'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import vueJsx from '@vitejs/plugin-vue-jsx'

function mutateCookieAttributes (proxy) {
  proxy.on('proxyRes', function (proxyRes, req, res) {
    if (proxyRes.headers['set-cookie']) {
      proxyRes.headers['set-cookie'] = (proxyRes.headers['set-cookie']).map(h => {
        return h.replace(/Domain=.*;/, 'Domain=localhost; Secure;')
      })
    }
  })
}

function setHostHeader(proxy) {
  const host = new URL(process.env.VITE_PORTAL_API_URL).hostname

  proxy.on('proxyReq', function (proxyRes) {
    proxyRes.setHeader('host', host)
  })
}

/**
 * Defines the default values for environment variables
 */
function defaultsMandatoryEnvVars (command) {
  // Defaults to /
  process.env.VITE_PORTAL_API_URL ||= '/'

  // Sets VITE_INDEX_API_URL which is templated in index.html
  process.env.VITE_INDEX_API_URL = command === 'serve' ? '/' : process.env.VITE_PORTAL_API_URL

  // Defaults locale to en
  process.env.VITE_LOCALE ||= 'en'
}

export default defineConfig(async ({ command, mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  defaultsMandatoryEnvVars(command)

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

  return {
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
    }
  }
})
