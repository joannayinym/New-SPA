import { StatementDetail, SummaryData } from "../types/types";
import { DATA } from "./data";

export const filterDataBySelection = ({
  selection,
}: {
  selection: keyof StatementDetail;
}) => {
  const originData = DATA as StatementDetail[];
  const result = originData.reduce(
    (acc: Record<string, SummaryData>, v: StatementDetail) => {
      const { amount, balance } = v;
      let key: string = "";
      if ((selection as string) === "date") {
        const dateString = v["transaction_date"].slice(0, 10);
        if (dateString) {
          key = dateString.split("-").reverse().join("-");
        }
      } else {
        key = v[selection] as string;
      }
      if (!key) {
        key = "Unknown";
      }
      const previousValue = acc[key];
      if (previousValue) {
        return {
          ...acc,
          [key]: {
            key,
            amount: previousValue.amount + amount,
            balance: previousValue.balance + balance,
          },
        };
      }

      return {
        ...acc,
        [key]: { key, amount, balance },
      };
    },
    {} as Record<string, SummaryData>
  );

  return Object.values(result);
};
