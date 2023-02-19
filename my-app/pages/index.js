import Head from "next/head";
import Web3Modal from "web3modal";
import styles from "@/styles/Home.module.css";
import { useRef } from "react";
import { ethers, providers } from "ethers";
import { DeFaSABI, DeFaSContractAddress } from "@/constant";
import { FETCH_QUERIES } from "@/queries";
import { subgraphQuery } from "../utils";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  //constants
  const SECONDS_PER_DAY = 24 * 60 * 60;
  const SECONDS_PER_HOUR = 60 * 60;
  const SECONDS_PER_MINUTE = 60;
  const OFFSET19700101 = 2440588;

  const web3ModalRef = useRef();

  //for finding timestamp from a date and time
  const _daysFromDate = (_year, _month, _day) => {
    if (_year >= 1970) {
      const days =
        _day -
        32075 +
        (1461 * (_year + 4800 + (_month - 14) / 12)) / 4 +
        (367 * (_month - 2 - ((_month - 14) / 12) * 12)) / 12 -
        (3 * ((_year + 4900 + (_month - 14) / 12) / 100)) / 4 -
        OFFSET19700101;

      return days;
    } else {
      console.log("Invalid Time");
    }
  };
  const timestampFromDateTime = (year, month, day, hour, minute, second) => {
    return (
      _daysFromDate(year, month, day) * SECONDS_PER_DAY +
      hour * SECONDS_PER_HOUR +
      minute * SECONDS_PER_MINUTE +
      second
    );
  };
  //createContest
  const createContest = async (
    maxParticipant,
    enytryFee,
    startingTime,
    closingTime
  ) => {
    try {
      const signer = await getProviderOrSigner(true);
      const defas = new ethers.Contract(DeFaSContractAddress, DeFaSABI, signer);

      const transactionResponse = await defas.createContest(
        maxParticipant,
        enytryFee,
        startingTime,
        closingTime
      );
      await transactionResponse.wait(1);
    } catch (error) {
      console.log(error);
    }
  };
  //joinContest

  const joinContest = async (constestId) => {
    try {
      const signer = await getProviderOrSigner(true);
      const defas = new ethers.Contract(DeFaSContractAddress, DeFaSABI, signer);
      const transactionResponse = await defas.joinContest(constestId);

      await transactionResponse.wait();
    } catch (error) {
      console.log();
    }
  };

  //setTheStatus of the contest-onlyOwnner method

  const setStatusOfTheContest = async (status, constestID) => {
    try {
      const signer = await getProviderOrSigner(true);
      const defas = new ethers.Contract(DeFaSContractAddress, DeFaSABI, signer);
      const transactionResponse = await defas.set(status, constestID);
      await transactionResponse.wait(1);
    } catch (error) {
      console.log(error);
    }
  };

  //AnnounceWinner-onlyOwner;
  const AnnounceWinner = async (constestID, winner) => {
    try {
      const signer = await getProviderOrSigner(true);
      const defas = new ethers.Contract(DeFaSContractAddress, DeFaSABI, signer);

      const transactionResponse = await defas.AnnounceWinner(
        constestID,
        winner
      );
      await transactionResponse.wait(1);
    } catch (error) {
      console.log(error);
    }
  };

  //withdraw Money

  const withDrawMoney = async (amount) => {
    try {
      const signer = await getProviderOrSigner(true);
      const defas = new ethers.Contract(DeFaSContractAddress, DeFaSABI, signer);

      const transactionResponse = await defas.withDrawYourMoney(amount);
      await transactionResponse.wait(1);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * getter function
   * to see the all the values
   * it is coming from getter functions of contract where we don't need any signer
   * just provider since we are not signing any transactions
   *
   */

  //getContractBalance
  const getContractBalance = async () => {
    try {
      const provider = await getProviderOrSigner();
      const defas = new ethers.Contract(
        DeFaSContractAddress,
        DeFaSABI,
        provider
      );

      const transactionResponse = await defas.getContractBalance();
      await transactionResponse.wait(1);
    } catch (error) {
      console.log(error);
    }
  };
  //get your balance

  const getBalance = async (addressOfParticipant) => {
    try {
      const provider = await getProviderOrSigner();
      const defas = new ethers.Contract(
        DeFaSContractAddress,
        DeFaSABI,
        provider
      );

      const transactionResponse = await defas.getContestsOfParticipant(
        addressOfParticipant
      );

      await transactionResponse.wait(1);
    } catch (error) {
      console.log(error);
    }
  };
  //
  //find all the contest played by a participant
  const getAllContestOfParticipant = async (addressOfParticipant) => {
    try {
      const provider = await getProviderOrSigner();
      const defas = new ethers.Contract(
        DeFaSContractAddress,
        DeFaSABI,
        provider
      );

      const transactionResponse = await defas.getContestsOfParticipant(
        addressOfParticipant
      );

      await transactionResponse.wait(1);
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  //

  return <></>;
}
