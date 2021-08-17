import { makeStyles } from "@material-ui/core";
import { FormControl, Select, MenuItem } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SummaryTable from "../components/SummaryTable";
import { DATA } from "./data";

export enum SelectType {
  category = "category",
  type = "type",
  date = "date",
}

export interface StatementDetail {
  id: string;
  type: string;
  category: string;
  amount: number;
  balance: number;
  transaction_date: string;
  day_sequence: number;
}

export interface SummaryData {
  key: string;
  amount: number;
  balance: number;
}

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 750,
    margin: "auto",
  },
  content: {
    display: "block",
    maxWidth: 1264,
  },
  formControl: {
    display: "block",
    margin: theme.spacing(1),
    // minWidth: 120,
    width: 200,
    "& .MuiInputBase-input": {
      width: 200,
    },
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  titleWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 160,
    width: "100%",
    background:
      "repeating-linear-gradient(rgba(0, 0, 0, 0) 7px, rgb(34, 34, 34) 9px, rgb(17, 17, 17) 13px, rgba(0, 0, 0, 0) 13px) rgb(34, 34, 34)",
    alignContent: "center",
  },
  title: {
    fontSize: "2em",
    lineHeight: "1em",
    margin: 0,
    textShadow:
      "rgb(33, 150, 243) 0px 0px 5px, rgb(33, 150, 243) 0px 0px 15px, rgb(33, 150, 243) 0px 0px 20px, rgb(33, 150, 243) 0px 0px 40px, rgb(63, 81, 181) 0px 0px 60px, rgb(156, 39, 176) 0px 0px 10px, rgb(63, 81, 181) 0px 0px 98px",
    color: "rgb(240, 242, 253)",
    fontWeight: 300,
    fontFamily: " Monoton, cursive",
    textAlign: "center",
    width: "100%",
    marginBottom: 20,
  },
}));

const filterDataBySelection = ({
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

const Home = () => {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const classes = useStyles();
  const [selectOptions, setSelectOptions] = useState<SelectType>(
    SelectType.category
  );

  const handleSelectionChanged = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectOptions(event.target.value as SelectType);
  };

  useEffect(() => {
    const filteredData = filterDataBySelection({
      selection: selectOptions as keyof StatementDetail,
    });
    setFilteredData(filteredData);
  }, [selectOptions]);

  return (
    <div style={{ backgroundColor: "#f8f9f9", paddingBottom: 32 }}>
      <div className={classes.titleWrapper}>
        <div className={classes.title}>Summary of bank statement</div>
      </div>
      <div className={classes.container}>
        <FormControl variant="outlined" className={classes.formControl}>
          <Select value={selectOptions} onChange={handleSelectionChanged}>
            <MenuItem value={SelectType.type}>{SelectType.type}</MenuItem>
            <MenuItem value={SelectType.category}>
              {SelectType.category}
            </MenuItem>
            <MenuItem value={SelectType.date}>{SelectType.date}</MenuItem>
          </Select>
        </FormControl>

        <div className={classes.content}>
          <SummaryTable data={filteredData} selection={selectOptions} />
        </div>
      </div>
    </div>
  );
};

export default Home;
