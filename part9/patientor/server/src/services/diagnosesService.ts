import diagnosesData from '../../data/diagnoses';
import { diagnosesEntry } from '../types';

export const getEntries = () : diagnosesEntry[] => {
    return diagnosesData;
};