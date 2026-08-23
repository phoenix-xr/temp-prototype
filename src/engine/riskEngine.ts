export interface RiskWeights {
  rainfall: number;
  slope: number;
  soilMoisture: number;
  historical: number;
}

export const LSI_WEIGHTS: RiskWeights = {
  rainfall: 0.35,
  slope: 0.30,
  soilMoisture: 0.20,
  historical: 0.15
};
