import CSPBuilder from "content-security-policy-builder";
import { MiddlewareFactory } from "@/middlewares/types";

// Default CSP directives based on helmet js.
const defaultCSP = {
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "font-src": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'self'"],
  "img-src": ["'self'", "data:"],
  "object-src": ["'none'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "script-src-attr": ["'none'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "connect-src": ["'self'"],
};

function addExtraCSP(env: string | undefined, directive: string[]) {
  try {
    const parsedEnv = env && JSON.parse(env);
    if (Array.isArray(parsedEnv)) {
      directive.push(...parsedEnv);
    }
  } catch (e) {
    throw Error(`could not JSON parse ${env}`);
  }
}

addExtraCSP(process.env.csp_extra_img_src, defaultCSP["img-src"]);
addExtraCSP(process.env.csp_extra_script_src, defaultCSP["script-src"]);
addExtraCSP(process.env.csp_extra_connect_src, defaultCSP["connect-src"]);

const cspDirectives = CSPBuilder({ directives: defaultCSP });

/**
 * Middleware for setting CSP and other relevant Headers.
 */
export const withHeadersMiddleware: MiddlewareFactory = (
  _request,
  response,
) => {
  response.headers.set("Content-Security-Policy", cspDirectives);
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
};
