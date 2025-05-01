interface ExerciseValues{ 
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
  }

interface values{
    target: number,
    record: number[]
}

const getValues = (args: string[]) : values => {
    if (!args.slice(2, args.length).find(arg => isNaN(Number(arg)))) {
        return {
            target: Number(args[2]),
            record: args.slice(3, args.length).map(Number)
        };
    } else throw new Error('provided data were not numbers');
};

export const calculateExercises = (data : number[], target: number) : ExerciseValues => {
    const total = data.reduce((sum, cur) => sum + cur, 0 );
    const average = total / data.length;
    return { 
        periodLength: data.length,
        trainingDays: data.filter(day => day !== 0).length,
        success: average >= target ? true : false,
        rating: average >= target ? 3 : 2,
        ratingDescription: average >= target ? 'awesome' : 'you need to work harder',
        target,
        average: average
      };
};

try {
    const { target, record } = getValues(process.argv);
    console.log(target);
    const result = calculateExercises(record, target);
    console.log(result);
} catch (error : unknown) {
    let errorMessage = 'something bad happend';
    if (error instanceof Error) {
        errorMessage += error.message;
    }
    console.log(errorMessage);
}


export {};