const health = require('./health');
test('return status code 200', () => {
    let mockResponse = {
        sendStatus: jest.fn()
    };
    health.setSuccessResponse(mockResponse);

    expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
    expect(mockResponse.sendStatus.mock.calls[0][0]).toEqual(200);

})

