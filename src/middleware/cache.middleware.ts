import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, of, tap } from "rxjs";
import LRUCache from "src/cachingStrategies/lru";
import SmartEviction from "src/common/SmartEviction/SmartEviction";

@Injectable()
export class CacheInterceptor implements NestInterceptor {

    cache = new LRUCache(2)

    smartEvictionManager = new SmartEviction()

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now()
        const { method, url, body } = context.switchToHttp().getRequest()

        const cachedResponse = this.cache.get({ method, url, ...body })

        if (cachedResponse) {
            return of(cachedResponse)
        }

        return next.handle()
            .pipe(
                tap((data) => {
                    this.cache.set({ method, url, ...body }, data)
                }),
            );
    }
}