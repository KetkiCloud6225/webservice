const health = require('./health');
test('return status code 200', () => {
    let mockResponse = {
        status: jest.fn(),
        json: jest.fn()
    };
    health.setSuccessResponse(mockResponse, true);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.status.mock.calls[0][0]).toEqual(200);
    expect(mockResponse.json.mock.calls[0][0].description).toEqual('Healhty');

})

