import { useState, useEffect, useCallback } from "react";
import { VehicleCarolData, defaultVehicleCarolData } from "@/types/vehicleCarol";

const LOCAL_KEY = "vehicle-carol-data";

export function getStoredVehicleCarolData(): VehicleCarolData {
  try {
    const data = localStorage.getItem(LOCAL_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...defaultVehicleCarolData, ...parsed };
    }
    return defaultVehicleCarolData;
  } catch {
    return defaultVehicleCarolData;
  }
}

export function saveVehicleCarolData(data: VehicleCarolData): void {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

export function useVehicleCarolData() {
  const [data, setData] = useState<VehicleCarolData>(getStoredVehicleCarolData);

  useEffect(() => {
    saveVehicleCarolData(data);
  }, [data]);

  const updateCarLoan = useCallback((updates: Partial<VehicleCarolData["carLoan"]>) => {
    setData((prev) => ({
      ...prev,
      carLoan: { ...prev.carLoan, ...updates },
    }));
  }, []);

  const updateInsurance = useCallback((updates: Partial<VehicleCarolData["insurancePaidByCarol"]>) => {
    setData((prev) => ({
      ...prev,
      insurancePaidByCarol: { ...prev.insurancePaidByCarol, ...updates },
    }));
  }, []);

  const updateCreditLine = useCallback((updates: Partial<VehicleCarolData["carolCreditLine"]>) => {
    setData((prev) => ({
      ...prev,
      carolCreditLine: { ...prev.carolCreditLine, ...updates },
    }));
  }, []);

  return {
    data,
    setData,
    updateCarLoan,
    updateInsurance,
    updateCreditLine,
  };
}
