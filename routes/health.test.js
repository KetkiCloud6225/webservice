const health = require('./health');
test('return status code 200', () => {
    let mockResponse = {
        status: jest.fn(),
        json: jest.fn()
    };
    health.setSuccessResponse(mockResponse);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status.mock.calls[0][0]).toEqual(200);
    

})

