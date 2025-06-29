import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, of, tap } from "rxjs";
import LRUCache from "src/cachingStrategies/lru";

@Injectable()
export class CacheInterceptor implements NestInterceptor {

    cache = new LRUCache(2)

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now()
        const { method, url, body } = context.switchToHttp().getRequest()

        console.log('Before...', method, url, body);

        const cachedResponse = this.cache.get({method, url, ...body})

        console.log("🚀 ~ CacheInterceptor ~ intercept ~ cachedResponse:", cachedResponse)
        if(cachedResponse) {
            return of(cachedResponse)
        }

        return next.handle()
            .pipe(
                tap((data) => {
                    console.log(`After... ${JSON.stringify(data)} - ${Date.now() - now}ms`)
                    this.cache.set({method, url, ...body}, data)
                }),
            );
    }
}