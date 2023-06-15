import Transport from "@ledgerhq/hw-transport";
import { withDevice } from "./deviceAccess";
import { of } from "rxjs";

const deviceId = "test_device";

// Only mocks open
jest.mock(".", () => {
  // Imports and retains the original functionalities
  const originalModule = jest.requireActual(".");

  return {
    ...originalModule,
    open: jest.fn().mockReturnValue(Promise.resolve(new Transport())),
  };
});

describe("withDevice", () => {
  describe("When there is only one job", () => {
    it("should provide a transport and run the given job", done => {
      const job = jest.fn().mockReturnValue(of("job test result"));

      withDevice(deviceId)(job).subscribe({
        next: () => {
          try {
            expect(job).toHaveBeenCalledWith(expect.any(Transport));
            done();
          } catch (expectError) {
            done(expectError);
          }
        },
        error: e => done(`It should not have failed: ${JSON.stringify(e)}`),
      });
    });
  });
});
