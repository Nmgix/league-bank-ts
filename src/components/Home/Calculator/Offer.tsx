import React, { useContext, useEffect, useState } from "react";
import { CalculatorsLending, OurOffer, FirstStep, CalculationErrors } from "../../../interfaces/ICalculator";
import { Context } from "../../essentials/ContextWraper";

export const Offer: React.FC<{ step: keyof typeof FirstStep }> = ({ step }) => {
  const context = useContext(Context);
  const state = context.state;

  const [error, setError] = useState<keyof typeof CalculationErrors | null>(null);

  const calculateLending = (state: any, step: keyof typeof FirstStep): OurOffer => {
    const resultState: OurOffer = {
      loan_amount: null,
      interest_rate: null,
      monthly_payment: null,
      required_income: null,
    };

    var tempState: { [x: string]: number | null } = {
      procentRateMonth: null,
      procentSum: null,
    };

    const getPayMonth = (cost: number, procRateMonth: number) => {
      var countPeriods = state.loan_term.value * 12;
      resultState.monthly_payment = Math.round(
        cost * (procRateMonth / (1 - 1 / Math.pow(1 + procRateMonth, countPeriods)))
      );
      resultState.required_income = Math.round(resultState.monthly_payment / 0.45);
    };

    switch (step) {
      case "mortgageLending": {
        if (state.parent_capital && state.estate_cost && state.initial_payment) {
          if (state.parent_capital && state.parent_capital.value) {
            resultState.loan_amount = state.estate_cost.value - state.initial_payment.value - 470000;
          } else {
            resultState.loan_amount = state.estate_cost.value - state.initial_payment.value;
          }

          if ((state.initial_payment.value / state.estate_cost.value) * 100 >= 33) {
            resultState.interest_rate = 8.5;
            tempState.procRateMonth = 8.5 / 100 / 12;
          } else {
            resultState.interest_rate = 9.5;
            tempState.procRateMonth = 9.4 / 100 / 12;
          }

          getPayMonth(resultState.loan_amount, tempState.procRateMonth);

          return resultState;
        } else {
          return resultState;
        }
      }

      case "carLending": {
        if (state.car_cost && state.initial_payment && state.casko) {
          resultState.loan_amount = state.car_cost.value - state.initial_payment.value;

          if (state.casko.value && state.insurance.value) {
            resultState.interest_rate = 3.5;
            tempState.procRateMonth = 3.5 / 100 / 12;
          } else if (state.casko.value || state.insurance.value) {
            resultState.interest_rate = 8.5;
            tempState.procRateMonth = 8.5 / 100 / 12;
          } else if (state.car_cost.value >= 2000000) {
            resultState.interest_rate = 15;
            tempState.procRateMonth = 15 / 100 / 12;
          } else {
            resultState.interest_rate = 16;
            tempState.procRateMonth = 16 / 100 / 12;
          }

          getPayMonth(resultState.loan_amount, tempState.procRateMonth);

          return resultState;
        } else {
          return resultState;
        }
      }

      case "consumerLending": {
        if (state.consumer_loan_cost && state.member) {
          resultState.loan_amount = state.consumer_loan_cost.value;

          if (state.member.value) {
            if (state.consumer_loan_cost.value >= 2000000) {
              resultState.interest_rate = 9;
              tempState.procRateMonth = 9 / 100 / 12;
            } else if (state.consumer_loan_cost.value >= 750000 && state.consumer_loan_cost.value < 2000000) {
              resultState.interest_rate = 12;
              tempState.procRateMonth = 12 / 100 / 12;
            } else {
              resultState.interest_rate = 14.5;
              tempState.procRateMonth = 14.5 / 100 / 12;
            }
          } else {
            if (state.consumer_loan_cost.value >= 2000000) {
              resultState.interest_rate = 9.5;
              tempState.procRateMonth = 9.5 / 100 / 12;
            } else if (state.consumer_loan_cost.value >= 750000 && state.consumer_loan_cost.value < 2000000) {
              resultState.interest_rate = 12.5;
              tempState.procRateMonth = 12.5 / 100 / 12;
            } else {
              resultState.interest_rate = 15;
              tempState.procRateMonth = 15 / 100 / 12;
            }
          }

          getPayMonth(resultState.loan_amount!, tempState.procRateMonth);

          return resultState;
        } else {
          return resultState;
        }
      }

      default: {
        return resultState;
      }
    }
  };

  const [calculationState, setState] = useState<OurOffer>(calculateLending(state!, step));

  const { loan_amount, interest_rate, monthly_payment, required_income } = calculationState;

  useEffect(() => {
    if (state.estate_cost && state.initial_payment && state.parent_capital) {
      if (state.estate_cost.value && state.initial_payment.value) {
        if (state.estate_cost.value <= state.initial_payment.value) {
          if (error === null) {
            setError(CalculationErrors.threshold);
            return setState(state);
          }
        } else if (
          state.estate_cost.value - state.initial_payment.value - 470000 <= 0 &&
          state.parent_capital.value === true
        ) {
          if (error === null) {
            setError(CalculationErrors.threshold);
            return setState(state);
          }
        } else {
          if (error !== null) {
            setError(null);
          }
        }
      }
    }

    if (state.car_cost && state.initial_payment) {
      if (state.car_cost.value && state.initial_payment.value) {
        if (state.car_cost.value <= state.initial_payment.value) {
          if (error === null) {
            setError(CalculationErrors.threshold);
            return setState(state);
          }
        } else {
          if (error !== null) {
            setError(null);
          }
        }
      }
    }

    setState(calculateLending(state!, step));
  }, [state]);

  if (error !== null) {
    switch (error) {
      case CalculationErrors.minThersholdError: {
        return (
          <div className='offer'>
            <h3 className='offer-title'>
              ?????? ???????? ???? ????????????{" "}
              {step === "mortgageLending" ? "?????????????????? ??????????????" : step === "carLending" ? "??????????????????????" : "??????????????"}{" "}
              ???????????? 200000 ????????????
            </h3>
            <span className='error-text'>???????????????????? ???????????????????????? ???????????? ?????????????????? ?????? ??????????????</span>
          </div>
        );
      }
      case CalculationErrors.maxThersholdError: {
        return (
          <div className='offer'>
            <h3 className='offer-title'>
              ?????? ???????? ???? ????????????{" "}
              {step === "mortgageLending" ? "?????????????????? ??????????????" : step === "carLending" ? "??????????????????????" : "??????????????"}{" "}
              ???????????? 2500000{" "}
              {/* ?????????? ?? ?? ?????????????????? ?????????? ???? ?????????? ?????????? ???????????????????????? ??????????, ?????????? ?????????????????????????????? ???? ???????????? ???????????????? ?????????? ???????? ?????????????? ???? ????????????????, ???? Calculator ?? Offer ???? ?????????????????? ?? step */}{" "}
              ????????????
            </h3>
            <span className='error-text'>???????????????????? ???????????????????????? ???????????? ?????????????????? ?????? ??????????????</span>
          </div>
        );
      }
      case CalculationErrors.threshold: {
        return (
          <div className='offer'>
            <h3 className='offer-title'>???????????????? ?????????? ????????????</h3>
            <span className='error-text'>
              ???????????? ????????????????{" "}
              {state.estate_cost.value - state.initial_payment.value && state.parent_capital.value > 0 ? (
                <span>?? ?????????????????????? ??????????????????</span>
              ) : (
                <></>
              )}{" "}
              ???? ???????????????????? ????????????
            </span>
          </div>
        );
      }
      default:
        return (
          <div className='offer'>
            <h3 className='offer-title'>?? ?????????????????? ??????-???? ?????????? ???? ??????</h3>
            <span className='error-text'>???????????????????? ???????????????????????? ???????????? ?????????????????? ?????? ??????????????</span>
          </div>
        );
    }
  }

  return (
    <div className='offer'>
      <h3 className='offer-title'>???????? ??????????????????????</h3>
      <div className='calculation'>
        <div>
          <p>{loan_amount ? <>{loan_amount} ????????????</> : <></>}</p>
          <span>
            ?????????? {step === "mortgageLending" ? "??????????????" : step === "carLending" ? "??????????????????????" : "??????????????"}
          </span>
        </div>
        <div>
          <p>{interest_rate ? <>{interest_rate} %</> : <></>}</p>
          <span>???????????????????? ????????????</span>
        </div>
        <div>
          <p>{monthly_payment ? <>{monthly_payment} ????????????</> : <></>}</p>
          <span>?????????????????????? ????????????</span>
        </div>
        <div>
          <p>{required_income ? <>{required_income} ????????????</> : <></>}</p>
          <span>?????????????????????? ??????????</span>
        </div>
      </div>
      <button className='button button-primary'>???????????????? ????????????</button>
    </div>
  );
};
