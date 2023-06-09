import { ActivatedRouteSnapshot } from "@angular/router";
import { NGXLogger } from "ngx-logger";

export interface HandlerContext {
    route: ActivatedRouteSnapshot,
    logger: NGXLogger,
}