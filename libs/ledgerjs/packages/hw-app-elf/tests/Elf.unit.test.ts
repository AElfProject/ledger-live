import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import Elf from "../src/Elf";

jest.mock("axios");

describe("AElf app binding", () => {
  const DERIVATION_PATH = "m/44'/1616'/0'/0/0";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("getAppConfiguration", async () => {
    const transport = await openTransportReplayer(
      RecordStore.fromString(`
    => e001000000
    <= 00010100049000
    `),
    );

    const elf = new Elf(transport);
    const result = await elf.getAppConfiguration();

    expect(result).toEqual({
      version: "1.0.4",
    });
  });

  test("getAddress", async () => {
    const transport = await openTransportReplayer(
      RecordStore.fromString(`
      => e002000015058000002c80000650800000000000000000000000
      <= 04a1a2d994e07e7f34ed6d3b6850bb7c534ee481aa52d6a076d52667e3efefc2d840ab9e4a9be21d42f2802deb7ceee31a13a62646deba6745429ad8654d30d2c19000
      `),
    );

    const elf = new Elf(transport);
    const result = await elf.getAddress(DERIVATION_PATH);

    expect(result).toEqual({
      address: "d41uXjj7AmvDjkCU9bvfWpZdYEjpVyxmTBSc6fsdkB2L4dGos",
      publicKey:
        "04a1a2d994e07e7f34ed6d3b6850bb7c534ee481aa52d6a076d52667e3efefc2d840ab9e4a9be21d42f2802deb7ceee31a13a62646deba6745429ad8654d30d2c1",
    });
  });

  test("getAddress with display", async () => {
    const transport = await openTransportReplayer(
      RecordStore.fromString(`
      => e002010015058000002c80000650800000000000000000000000
      <= 04a1a2d994e07e7f34ed6d3b6850bb7c534ee481aa52d6a076d52667e3efefc2d840ab9e4a9be21d42f2802deb7ceee31a13a62646deba6745429ad8654d30d2c19000
      `),
    );

    const elf = new Elf(transport);
    const result = await elf.getAddress(DERIVATION_PATH, true);

    expect(result).toEqual({
      address: "d41uXjj7AmvDjkCU9bvfWpZdYEjpVyxmTBSc6fsdkB2L4dGos",
      publicKey:
        "04a1a2d994e07e7f34ed6d3b6850bb7c534ee481aa52d6a076d52667e3efefc2d840ab9e4a9be21d42f2802deb7ceee31a13a62646deba6745429ad8654d30d2c1",
    });
  });

  test("signTransaction", async () => {
    const transport = await openTransportReplayer(
      RecordStore.fromString(`
      => e0030100b101058000002c800006508000000000000000000000000a220a20d736f33c7c2a35a04603fd3e94d5395c29edd9ac159bed03e366c8fb700b7d1812220a202791e992a57f28e75a11f13af2c0aec8b0eb35d2f048d42eba8901c92e0378dc18c7ab95552204a13980492a085472616e73666572323c0a220a204ff4e63ad4aa7ec92e65ba2d37b2c56b3f82390bfc25e66cebab6821f3b05c0b1203454c461880d4dbd20f220b612074657374206d656d6f
      <= fdebf82f946f7e5acbaf3237f9725ed89f462e4cb786441bf458db5a3cb5cbf85380eb3321c3dbc9943f022ce6d8978f46baadbfd5eea8bf097bed5ae6312ec5009000
      `),
    );

    const elf = new Elf(transport);
    const result = await elf.signTransaction(
      DERIVATION_PATH,
      "0a220a20d736f33c7c2a35a04603fd3e94d5395c29edd9ac159bed03e366c8fb700b7d1812220a202791e992a57f28e75a11f13af2c0aec8b0eb35d2f048d42eba8901c92e0378dc18c7ab95552204a13980492a085472616e73666572323c0a220a204ff4e63ad4aa7ec92e65ba2d37b2c56b3f82390bfc25e66cebab6821f3b05c0b1203454c461880d4dbd20f220b612074657374206d656d6f",
    );

    expect(result).toEqual({
      signature:
        "fdebf82f946f7e5acbaf3237f9725ed89f462e4cb786441bf458db5a3cb5cbf85380eb3321c3dbc9943f022ce6d8978f46baadbfd5eea8bf097bed5ae6312ec500",
    });
  });
});
