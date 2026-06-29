// vite.config.ts
import path from "path";
import { defineConfig } from "file:///D:/RNS%20Retail/POSPrime/frontend/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/RNS%20Retail/POSPrime/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import frappeui from "file:///D:/RNS%20Retail/POSPrime/frontend/node_modules/frappe-ui/vite/index.js";
import Icons from "file:///D:/RNS%20Retail/POSPrime/frontend/node_modules/unplugin-icons/dist/vite.mjs";
import electron from "file:///D:/RNS%20Retail/POSPrime/frontend/node_modules/vite-plugin-electron/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\RNS Retail\\POSPrime\\frontend";
function injectFrappeContext() {
  return {
    name: "inject-frappe-context",
    apply: "build",
    transformIndexHtml(html) {
      const jinjaBlock = [
        '{%- set _user_theme = (frappe.db.get_value("User", frappe.session.user, "desk_theme") or "Light").lower() -%}',
        '{%- set ws = frappe.get_doc("Website Settings") -%}'
      ].join("\n");
      html = html.replace(
        '<html lang="en">',
        jinjaBlock + '\n<html lang="en" data-theme-mode="{{ _user_theme }}" data-theme="{{ _user_theme }}">'
      );
      html = html.replace(
        "<title>POS Prime</title>",
        [
          '<title>{{ ws.app_name or "POS Prime" }}</title>',
          '  {% if ws.favicon %}<link rel="icon" href="{{ ws.favicon }}">{% endif %}'
        ].join("\n  ")
      );
      html = html.replace(
        "</head>",
        [
          '  <script>window.csrf_token = "{{ frappe.session.csrf_token }}";</script>',
          "  <script>",
          "    (function() {",
          '      var m = document.documentElement.getAttribute("data-theme-mode");',
          '      if (m === "automatic") {',
          '        var q = window.matchMedia("(prefers-color-scheme: dark)");',
          '        document.documentElement.setAttribute("data-theme", q.matches ? "dark" : "light");',
          '        q.addEventListener("change", function(e) {',
          '          document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");',
          "        });",
          "      }",
          "    })();",
          "  </script>",
          "  </head>"
        ].join("\n")
      );
      html = html.replace(
        '<div id="app">',
        [
          "<script>",
          "  (function() {",
          '    var p = window.location.pathname.replace(/\\/$/, "");',
          '    var standalone = ["/pos-prime/display", "/pos-prime/kiosk", "/pos-prime/customers"];',
          "    var isStandalone = standalone.some(function(s) { return p.startsWith(s); });",
          '    if (!isStandalone && p.startsWith("/pos-prime")) {',
          '      window.location.replace("{{ desk_prefix }}/pos-terminal");',
          "      return;",
          "    }",
          "  })();",
          "</script>",
          '<div id="app">'
        ].join("\n  ")
      );
      return html;
    }
  };
}
var isStandaloneBuild = true;
var vite_config_default = defineConfig({
  plugins: [
    ...isStandaloneBuild ? [] : [
      frappeui({
        buildConfig: {
          indexHtmlPath: path.resolve(
            __vite_injected_original_dirname,
            "../pos_prime/www/pos_prime.html"
          )
        }
      })
    ],
    vue(),
    Icons({
      autoInstall: true,
      compiler: "vue3"
    }),
    ...isStandaloneBuild ? [] : [injectFrappeContext()],
    electron([
      {
        entry: "electron/main.ts"
      },
      {
        entry: "electron/preload.ts",
        vite: {
          build: {
            rollupOptions: {
              output: {
                format: "cjs"
              }
            }
          }
        },
        onstart(options) {
          options.reload();
        }
      }
    ])
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  optimizeDeps: {
    include: ["frappe-ui > feather-icons", "showdown", "engine.io-client", "interactjs", "debug", "highlight.js/lib/core"]
  },
  base: isStandaloneBuild ? "./" : "/",
  build: isStandaloneBuild ? {
    outDir: "dist",
    emptyOutDir: true
  } : {
    manifest: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxSTlMgUmV0YWlsXFxcXFBPU1ByaW1lXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxSTlMgUmV0YWlsXFxcXFBPU1ByaW1lXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9STlMlMjBSZXRhaWwvUE9TUHJpbWUvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBQbHVnaW4gfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgZnJhcHBldWkgZnJvbSAnZnJhcHBlLXVpL3ZpdGUnXG5pbXBvcnQgSWNvbnMgZnJvbSAndW5wbHVnaW4taWNvbnMvdml0ZSdcbmltcG9ydCBlbGVjdHJvbiBmcm9tICd2aXRlLXBsdWdpbi1lbGVjdHJvbidcblxuLy8gSW5qZWN0IEZyYXBwZSBjb250ZXh0IGludG8gYnVpbHQgSFRNTC5cbi8vIEZyYXBwZSBwcm9jZXNzZXMgd3d3LyouaHRtbCB0aHJvdWdoIEppbmphLCBzbyB7eyB9fSBzeW50YXhcbi8vIGdldHMgcmVwbGFjZWQgd2l0aCBhY3R1YWwgdmFsdWVzIGF0IHNlcnZlIHRpbWUuXG5mdW5jdGlvbiBpbmplY3RGcmFwcGVDb250ZXh0KCk6IFBsdWdpbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2luamVjdC1mcmFwcGUtY29udGV4dCcsXG4gICAgYXBwbHk6ICdidWlsZCcsXG4gICAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWwpIHtcbiAgICAgIC8vIEZldGNoIHVzZXIgdGhlbWUgKyBXZWJzaXRlIFNldHRpbmdzIHZpYSBKaW5qYSAod3d3IHBhZ2VzIGRvbid0IGhhdmUgZGVza190aGVtZSBpbiBjb250ZXh0KVxuICAgICAgY29uc3QgamluamFCbG9jayA9IFtcbiAgICAgICAgJ3slLSBzZXQgX3VzZXJfdGhlbWUgPSAoZnJhcHBlLmRiLmdldF92YWx1ZShcIlVzZXJcIiwgZnJhcHBlLnNlc3Npb24udXNlciwgXCJkZXNrX3RoZW1lXCIpIG9yIFwiTGlnaHRcIikubG93ZXIoKSAtJX0nLFxuICAgICAgICAneyUtIHNldCB3cyA9IGZyYXBwZS5nZXRfZG9jKFwiV2Vic2l0ZSBTZXR0aW5nc1wiKSAtJX0nLFxuICAgICAgXS5qb2luKCdcXG4nKVxuXG4gICAgICAvLyBBZGQgdGhlbWUgYXR0cmlidXRlcyB0byA8aHRtbD4gdGFnXG4gICAgICBodG1sID0gaHRtbC5yZXBsYWNlKFxuICAgICAgICAnPGh0bWwgbGFuZz1cImVuXCI+JyxcbiAgICAgICAgamluamFCbG9jayArICdcXG48aHRtbCBsYW5nPVwiZW5cIiBkYXRhLXRoZW1lLW1vZGU9XCJ7eyBfdXNlcl90aGVtZSB9fVwiIGRhdGEtdGhlbWU9XCJ7eyBfdXNlcl90aGVtZSB9fVwiPidcbiAgICAgIClcblxuICAgICAgLy8gSW5qZWN0IHRpdGxlICsgZmF2aWNvbiBmcm9tIFdlYnNpdGUgU2V0dGluZ3NcbiAgICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoXG4gICAgICAgICc8dGl0bGU+UE9TIFByaW1lPC90aXRsZT4nLFxuICAgICAgICBbXG4gICAgICAgICAgJzx0aXRsZT57eyB3cy5hcHBfbmFtZSBvciBcIlBPUyBQcmltZVwiIH19PC90aXRsZT4nLFxuICAgICAgICAgICcgIHslIGlmIHdzLmZhdmljb24gJX08bGluayByZWw9XCJpY29uXCIgaHJlZj1cInt7IHdzLmZhdmljb24gfX1cIj57JSBlbmRpZiAlfScsXG4gICAgICAgIF0uam9pbignXFxuICAnKVxuICAgICAgKVxuXG4gICAgICAvLyBJbmplY3QgQ1NSRiB0b2tlbiArIHRoZW1lIGF1dG8tZGV0ZWN0aW9uIHNjcmlwdFxuICAgICAgaHRtbCA9IGh0bWwucmVwbGFjZShcbiAgICAgICAgJzwvaGVhZD4nLFxuICAgICAgICBbXG4gICAgICAgICAgJyAgPHNjcmlwdD53aW5kb3cuY3NyZl90b2tlbiA9IFwie3sgZnJhcHBlLnNlc3Npb24uY3NyZl90b2tlbiB9fVwiOzwvc2NyaXB0PicsXG4gICAgICAgICAgJyAgPHNjcmlwdD4nLFxuICAgICAgICAgICcgICAgKGZ1bmN0aW9uKCkgeycsXG4gICAgICAgICAgJyAgICAgIHZhciBtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtdGhlbWUtbW9kZVwiKTsnLFxuICAgICAgICAgICcgICAgICBpZiAobSA9PT0gXCJhdXRvbWF0aWNcIikgeycsXG4gICAgICAgICAgJyAgICAgICAgdmFyIHEgPSB3aW5kb3cubWF0Y2hNZWRpYShcIihwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyaylcIik7JyxcbiAgICAgICAgICAnICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBxLm1hdGNoZXMgPyBcImRhcmtcIiA6IFwibGlnaHRcIik7JyxcbiAgICAgICAgICAnICAgICAgICBxLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSkgeycsXG4gICAgICAgICAgJyAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBlLm1hdGNoZXMgPyBcImRhcmtcIiA6IFwibGlnaHRcIik7JyxcbiAgICAgICAgICAnICAgICAgICB9KTsnLFxuICAgICAgICAgICcgICAgICB9JyxcbiAgICAgICAgICAnICAgIH0pKCk7JyxcbiAgICAgICAgICAnICA8L3NjcmlwdD4nLFxuICAgICAgICAgICcgIDwvaGVhZD4nLFxuICAgICAgICBdLmpvaW4oJ1xcbicpXG4gICAgICApXG5cbiAgICAgIC8vIFJlZGlyZWN0IGNvcmUgUE9TIHJvdXRlcyB0byBkZXNrIHBhZ2U7IGtlZXAgc3RhbmRhbG9uZSBmb3IgZGlzcGxheS9raW9zay9jdXN0b21lcnNcbiAgICAgIC8vIFVzZXMgZGVza19wcmVmaXggZnJvbSB3d3cvcG9zX3ByaW1lLnB5IGNvbnRleHQgKHYxNisgPSAvZGVzaywgdjE0LXYxNSA9IC9hcHApXG4gICAgICBodG1sID0gaHRtbC5yZXBsYWNlKFxuICAgICAgICAnPGRpdiBpZD1cImFwcFwiPicsXG4gICAgICAgIFtcbiAgICAgICAgICAnPHNjcmlwdD4nLFxuICAgICAgICAgICcgIChmdW5jdGlvbigpIHsnLFxuICAgICAgICAgICcgICAgdmFyIHAgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFxcXC8kLywgXCJcIik7JyxcbiAgICAgICAgICAnICAgIHZhciBzdGFuZGFsb25lID0gW1wiL3Bvcy1wcmltZS9kaXNwbGF5XCIsIFwiL3Bvcy1wcmltZS9raW9za1wiLCBcIi9wb3MtcHJpbWUvY3VzdG9tZXJzXCJdOycsXG4gICAgICAgICAgJyAgICB2YXIgaXNTdGFuZGFsb25lID0gc3RhbmRhbG9uZS5zb21lKGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHAuc3RhcnRzV2l0aChzKTsgfSk7JyxcbiAgICAgICAgICAnICAgIGlmICghaXNTdGFuZGFsb25lICYmIHAuc3RhcnRzV2l0aChcIi9wb3MtcHJpbWVcIikpIHsnLFxuICAgICAgICAgICcgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShcInt7IGRlc2tfcHJlZml4IH19L3Bvcy10ZXJtaW5hbFwiKTsnLFxuICAgICAgICAgICcgICAgICByZXR1cm47JyxcbiAgICAgICAgICAnICAgIH0nLFxuICAgICAgICAgICcgIH0pKCk7JyxcbiAgICAgICAgICAnPC9zY3JpcHQ+JyxcbiAgICAgICAgICAnPGRpdiBpZD1cImFwcFwiPicsXG4gICAgICAgIF0uam9pbignXFxuICAnKVxuICAgICAgKVxuXG4gICAgICByZXR1cm4gaHRtbFxuICAgIH0sXG4gIH1cbn1cblxuY29uc3QgaXNTdGFuZGFsb25lQnVpbGQgPSB0cnVlXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgLi4uKGlzU3RhbmRhbG9uZUJ1aWxkID8gW10gOiBbXG4gICAgICBmcmFwcGV1aSh7XG4gICAgICAgIGJ1aWxkQ29uZmlnOiB7XG4gICAgICAgICAgaW5kZXhIdG1sUGF0aDogcGF0aC5yZXNvbHZlKFxuICAgICAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICAgICAgJy4uL3Bvc19wcmltZS93d3cvcG9zX3ByaW1lLmh0bWwnXG4gICAgICAgICAgKSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgXSksXG4gICAgdnVlKCksXG4gICAgSWNvbnMoe1xuICAgICAgYXV0b0luc3RhbGw6IHRydWUsXG4gICAgICBjb21waWxlcjogJ3Z1ZTMnLFxuICAgIH0pLFxuICAgIC4uLihpc1N0YW5kYWxvbmVCdWlsZCA/IFtdIDogW2luamVjdEZyYXBwZUNvbnRleHQoKV0pLFxuICAgIGVsZWN0cm9uKFtcbiAgICAgIHtcbiAgICAgICAgZW50cnk6ICdlbGVjdHJvbi9tYWluLnRzJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGVudHJ5OiAnZWxlY3Ryb24vcHJlbG9hZC50cycsXG4gICAgICAgIHZpdGU6IHtcbiAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgICAgICBmb3JtYXQ6ICdjanMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBvbnN0YXJ0KG9wdGlvbnMpIHtcbiAgICAgICAgICBvcHRpb25zLnJlbG9hZCgpXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFsnZnJhcHBlLXVpID4gZmVhdGhlci1pY29ucycsICdzaG93ZG93bicsICdlbmdpbmUuaW8tY2xpZW50JywgJ2ludGVyYWN0anMnLCAnZGVidWcnLCAnaGlnaGxpZ2h0LmpzL2xpYi9jb3JlJ10sXG4gIH0sXG4gIGJhc2U6IGlzU3RhbmRhbG9uZUJ1aWxkID8gJy4vJyA6ICcvJyxcbiAgYnVpbGQ6IGlzU3RhbmRhbG9uZUJ1aWxkID8ge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICB9IDoge1xuICAgIG1hbmlmZXN0OiB0cnVlLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVIsT0FBTyxVQUFVO0FBQzFTLFNBQVMsb0JBQTRCO0FBQ3JDLE9BQU8sU0FBUztBQUNoQixPQUFPLGNBQWM7QUFDckIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sY0FBYztBQUxyQixJQUFNLG1DQUFtQztBQVV6QyxTQUFTLHNCQUE4QjtBQUNyQyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxtQkFBbUIsTUFBTTtBQUV2QixZQUFNLGFBQWE7QUFBQSxRQUNqQjtBQUFBLFFBQ0E7QUFBQSxNQUNGLEVBQUUsS0FBSyxJQUFJO0FBR1gsYUFBTyxLQUFLO0FBQUEsUUFDVjtBQUFBLFFBQ0EsYUFBYTtBQUFBLE1BQ2Y7QUFHQSxhQUFPLEtBQUs7QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFVBQ0U7QUFBQSxVQUNBO0FBQUEsUUFDRixFQUFFLEtBQUssTUFBTTtBQUFBLE1BQ2Y7QUFHQSxhQUFPLEtBQUs7QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFVBQ0U7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsUUFDRixFQUFFLEtBQUssSUFBSTtBQUFBLE1BQ2I7QUFJQSxhQUFPLEtBQUs7QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFVBQ0U7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0YsRUFBRSxLQUFLLE1BQU07QUFBQSxNQUNmO0FBRUEsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFNLG9CQUFvQjtBQUMxQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxHQUFJLG9CQUFvQixDQUFDLElBQUk7QUFBQSxNQUMzQixTQUFTO0FBQUEsUUFDUCxhQUFhO0FBQUEsVUFDWCxlQUFlLEtBQUs7QUFBQSxZQUNsQjtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxNQUNKLGFBQWE7QUFBQSxNQUNiLFVBQVU7QUFBQSxJQUNaLENBQUM7QUFBQSxJQUNELEdBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDO0FBQUEsSUFDbkQsU0FBUztBQUFBLE1BQ1A7QUFBQSxRQUNFLE9BQU87QUFBQSxNQUNUO0FBQUEsTUFDQTtBQUFBLFFBQ0UsT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLFVBQ0osT0FBTztBQUFBLFlBQ0wsZUFBZTtBQUFBLGNBQ2IsUUFBUTtBQUFBLGdCQUNOLFFBQVE7QUFBQSxjQUNWO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsUUFDQSxRQUFRLFNBQVM7QUFDZixrQkFBUSxPQUFPO0FBQUEsUUFDakI7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLDZCQUE2QixZQUFZLG9CQUFvQixjQUFjLFNBQVMsdUJBQXVCO0FBQUEsRUFDdkg7QUFBQSxFQUNBLE1BQU0sb0JBQW9CLE9BQU87QUFBQSxFQUNqQyxPQUFPLG9CQUFvQjtBQUFBLElBQ3pCLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxFQUNmLElBQUk7QUFBQSxJQUNGLFVBQVU7QUFBQSxFQUNaO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
