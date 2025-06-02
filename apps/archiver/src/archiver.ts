import { prisma } from '@repo/db';
import { ArchiverMessage } from '@repo/common';

export class Archiver {
  private static instance: Archiver;

  constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Archiver();
    }
    return this.instance;
  }

  process(message: ArchiverMessage) {
    if (!message.type) {
      return;
    }

    switch (message.type) {
      case 'balance':
        const { payload } = message;
        const { userId, available, locked } = payload;
        this.UpdateBalance(userId, available, locked);
        break;
    }
  }

  async UpdateBalance(userId: string, available: number, locked: number) {
    await prisma.balance.update({
      where: {
        userId,
      },
      data: {
        available,
        locked,
      },
    });
    console.log(`balance of ${userId} updated, available: ${available} & locked: ${locked}`);
    return;
  }
}
