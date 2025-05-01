interface values{
    a: number,
    b: number,
}
const getValues = (args: string[]) : values => {
    if (args.length < 4) throw new Error('not enough argumnets');
    if (args.length > 4) throw new Error('too many arguments');
    
    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
        return {
            a: Number(args[2]),
            b: Number(args[3])
        };
    } else throw new Error('provided arguments were not numbers');
};
export const calculateBmi = (height: number, weight: number) => {
    if (height >= 150 && height <= 190 && weight >= 60 && weight <= 90) {
       if(require.main === module) {
        console.log('normal range');
       }
       return 'normal range';
    } else {
        if(require.main === module) {
            console.log('abnormal range');
        }
        return 'abnormal range';
    }
};
try { 
    if(require.main === module) {
        const { a, b} = getValues(process.argv);
        calculateBmi(a, b);
    } 
} catch (error: unknown) {
    let errorMessage = 'something bad happened';
    if ( error instanceof Error) {
        errorMessage += error.message;
    }
    console.log(errorMessage);
}

export {};