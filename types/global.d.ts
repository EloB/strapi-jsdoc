import type { RecurrenceSpecDateRange } from "node-schedule";
import type { RateLimitOptions } from "koa2-ratelimit";
import type { Knex } from "knex";

type JSONValue = object | number | string | null;

interface StrapiEnvHelper {
  <T>(key: string, defaultValue?: T): string | T;
  int<T>(key: string, defaultValue?: T): number | T;
  float<T>(key: string, defaultValue?: T): number | T;
  bool<T>(key: string, defaultValue?: T): boolean | T;
  json<T>(key: string, defaultValue?: T): JSONValue | T;
  array<T = undefined>(key: string, defaultValue?: T): string[] | T;
  date<T>(key: string, defaultValue?: T): Date | T;
}

type StrapiConfig<T> = T | ((options: { env: StrapiEnvHelper }) => T);

// config/admin
export interface StrapiConfigAdmin {
  apiToken: {
    salt: string;
  };
  auth: {
    events: {
      onConnectionSuccess(event: any): any;
      onConnectionError(event: any): any;
    };
    options: {
      expiresIn: string | number;
    };
    secret: string;
  },
  url?: string;
  autoOpen?: boolean;
  watchIgnoreFiles?: string[];
  host?: string;
  port?: number;
  serveAdminPanel?: boolean;
  forgotPassword?: {
    emailTemplate?: {
      subject: string;
      text: string;
      html: string;
    };
    from?: string;
    replyTo?: string;
  };
  rateLimit?: RateLimitOptions;
}

// config/api
export interface StrapiConfigApi {
  responses?: {
    privateAttributes?: string[];
  };
  rest?: {
    prefix?: string;
    defaultLimit?: number;
    maxLimit?: number;
  };
}

// config/database
export interface StrapiConfigDatabase {
  connection?: Knex.Config | string;
  settings?: {
    forceMigration?: boolean;
    runMigrations?: boolean;
  };
}

// config/middleware
export type StrapiMiddleware<T, K = {}> = T | { name: T; config?: K } | { resolve: T; config?: K };

export interface StrapiMiddlewares {
  "strapi::errors": StrapiMiddleware<"strapi::errors">;
  "strapi::security": StrapiMiddleware<"strapi::security">;
  "strapi::cors": StrapiMiddleware<"strapi::cors">;
  "strapi::poweredBy": StrapiMiddleware<"strapi::poweredBy">;
  "strapi::logger": StrapiMiddleware<"strapi::logger">;
  "strapi::query": StrapiMiddleware<"strapi::query", {
    strictNullHandling?: boolean;
    arrayLimit?: number;
    depth?: number;
  }>;
  "strapi::body": StrapiMiddleware<"strapi::body">;
  "strapi::session": StrapiMiddleware<"strapi::session">;
  "strapi::favicon": StrapiMiddleware<"strapi::favicon", {
    path?: string;
    maxAge?: number;
  }>;
  "strapi::public": StrapiMiddleware<"strapi::public">;
}

type StrapiConfigMiddleware = StrapiMiddlewares[keyof StrapiMiddlewares];

/**
 * Ability to extend new Middleware configs from plugins etc.
 *
 * @example
 * import { StrapiMiddleware } from "@strapi/strapi";
 *
 * declare module "@strapi/strapi" {
 *   export interface StrapiMiddlewares {
 *     "custom::hello": StrapiMiddleware<"custom::hello">
 *   }
 * }
 */

export type StrapiCronTask = (options: { strapi: Strapi }, time: Date) => any;

export type StrapiCronTasks = Record<string, {
  task: StrapiCronTask;
  options: RecurrenceSpecDateRange;
}> | Record<string, StrapiCronTask>;

// config/server
export interface StrapiConfigServer {
  host: string;
  port: number;
  app: {
    keys: string | string[];
  };
  socket?: string | number;
  emitErrors?: boolean;
  url?: string;
  proxy?: boolean;
  cron?: {
    enabled?: boolean;
    tasks?: StrapiCronTasks;
  };
  dirs?: {
    public?: string;
  };
}

declare global {
  namespace Strapi {
    /**
     * @link https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/admin-panel.html
     */
    type ConfigAdmin = StrapiConfig<StrapiConfigAdmin>;

    /**
     * @link https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/api.html
     */
    type ConfigApi = StrapiConfig<StrapiConfigApi>;

    /**
     * @link https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/databases.html
     */
    type ConfigDatabase = StrapiConfig<StrapiConfigDatabase>;

    /**
     * @link https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/middlewares.html
     */
    type ConfigMiddlewares = StrapiConfig<StrapiConfigMiddleware[]>;

    /**
     * @link https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/server.html
     */
    type ConfigServer = StrapiConfig<StrapiConfigServer>;
  }
}
