import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {

    private users: {
        id: string
        name: string
    }[] = [];

    async getAll(){
        await this.wait()
        return this.users
    }

    async get(id: string) {
        await this.wait()
        return this.users.filter(user => user.id = id)
    }

    async put(obj) {
        await this.wait()
        this.users.push(obj)
        return obj
    }

    wait = async () => {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res(true)
            }, 500)
        })
    }

}
