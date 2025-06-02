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
    const { type, payload } = message;
    if (!type || !payload) {
      return;
    }

    switch (type) {
      case 'balance': {
        const { userId, available, locked } = payload;
        this.UpdateBalance(userId, available, locked);
        break;
      }

      case 'mint': {
        const { userId, event, balanceAvailable, yesStockAvailable, noStockAvailable } = payload;
        this.MintStocks(userId, event, balanceAvailable, yesStockAvailable, noStockAvailable);
        break;
      }
    }
  }

  async UpdateBalance(userId: string, available: number, locked: number) {
    await prisma.balance.upsert({
      where: {
        userId,
      },
      update: {
        available,
        locked,
      },
      create: {
        userId,
        available,
        locked,
      },
    });

    console.log(
      `balance of ${userId} updated or created, available: ${available} & locked: ${locked}`
    );
  }

  async MintStocks(userId: string, event: string, balanceAvailable: number, yesStockAvailable: number, noStockAvailable: number) {
    await prisma.balance.update({
      where: {
        userId,
      },
      data: {
        available: balanceAvailable,
      },
    });

    await prisma.stock.upsert({
      where: {
        event,
      },
      update: {
        yes_available: yesStockAvailable, 
        no_available: noStockAvailable
      },
      create: {
        yes_available: yesStockAvailable,
        no_available: noStockAvailable,
        yes_locked: 0,
        no_locked: 0,
        event, 
        userId
      }
    });
  }
}

