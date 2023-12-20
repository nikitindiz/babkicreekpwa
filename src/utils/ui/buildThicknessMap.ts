interface BuildThicknessMapArgs {
  daysStats?: {
    drains: { expenses: number }[];
    sources: { incomes: number }[];
    moneyByTheEndOfTheDay: number;
  }[];
  maxMoneyValue: number;
}

export const buildThicknessMap = ({ daysStats, maxMoneyValue }: BuildThicknessMapArgs) => {
  const thicknessMap = [] as {
    sources: number[];
    drains: number[];
    beginningOfTheDayThickness: number;
    endOfTheDayThickness: number;
  }[];

  if (!daysStats) {
    return undefined;
  }

  daysStats.forEach((record) => {
    let { moneyByTheEndOfTheDay = 0, sources = [], drains = [] } = record;

    if (!moneyByTheEndOfTheDay) {
      moneyByTheEndOfTheDay = 0;
    }

    const totalFromSources = sources.reduce(
      (a, source) => a + (source?.incomes ? parseFloat(source.incomes as any) : 0),
      0,
    );
    const totalLossFromDrains = drains.reduce(
      (a, drain) => a + (drain?.expenses ? parseFloat(drain.expenses as any) : 0),
      0,
    );

    const beginningOfTheDayValue =
      parseFloat(moneyByTheEndOfTheDay as any) - totalFromSources + totalLossFromDrains;

    const map = {
      drains: [] as number[],
      sources: [] as number[],
      beginningOfTheDayThickness: beginningOfTheDayValue
        ? beginningOfTheDayValue / (maxMoneyValue * 0.01)
        : 0,
      endOfTheDayThickness: moneyByTheEndOfTheDay
        ? moneyByTheEndOfTheDay / (maxMoneyValue * 0.01)
        : 0,
    };

    let lastInteractedMoneyValue = beginningOfTheDayValue || 0;

    sources.forEach((source) => {
      lastInteractedMoneyValue += parseFloat(source?.incomes || ('0' as any));

      map.sources.push(
        lastInteractedMoneyValue ? lastInteractedMoneyValue / (maxMoneyValue * 0.01) : 0,
      );
    });

    drains.forEach((drain) => {
      lastInteractedMoneyValue -= parseFloat(drain?.expenses || ('0' as any));

      map.drains.push(
        lastInteractedMoneyValue ? lastInteractedMoneyValue / (maxMoneyValue * 0.01) : 0,
      );
    });

    thicknessMap.push(map);
  });

  return thicknessMap;
};
