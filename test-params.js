// Test date formats
const startDate = new Date();
startDate.setDate(startDate.getDate() - 6);

console.log('ISO format:', startDate.toISOString());
console.log('Date only:', startDate.toISOString().split('T')[0]);
