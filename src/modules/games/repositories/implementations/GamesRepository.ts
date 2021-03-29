import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder('game')
      .where("LOWER(game.title) like LOWER(:param)", { param: `%${param}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const count = await this.repository.count()

    return [{count: String(count)}]
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const games = await this.repository.findOneOrFail({
      where: {
        id
      },
      relations: ['users']
    })
    return games.users
  }
}
