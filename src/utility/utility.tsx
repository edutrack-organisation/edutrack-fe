export const csvFileToNumberArray = async (file: File): Promise<number[]> => {
    const text = await file.text();
    return text
        .trim()
        .split(/[\s,]+/) // Split by comma or whitespace
        .map(num => {
            const parsedNum = parseFloat(num.trim());
            return isNaN(parsedNum) ? 0 : parsedNum; // Default to 0 if invalid
        });
};


export const csvFileToNumberMatrix = async (file: File): Promise<number[][]> => {
    const text = await file.text();
    return text
        .trim()
        .split("\n") // Split by rows
        .map(line => 
            line.split(",").map(num => {
                const parsedNum = parseFloat(num.trim());
                return isNaN(parsedNum) ? 0 : parsedNum; // Default to 0 if invalid
            })
        );
};

export function transposeMatrix(matrix: number[][]): number[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    // Create a new matrix with reversed rows and columns
    const transposed: number[][] = [];
    
    for (let i = 0; i < cols; i++) {
        transposed[i] = [];
        for (let j = 0; j < rows; j++) {
            transposed[i][j] = matrix[j][i];
        }
    }
    
    return transposed;
}
