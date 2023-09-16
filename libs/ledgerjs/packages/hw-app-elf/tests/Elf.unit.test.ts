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
      => e002000015058000002c80000650800000008000000000000000
      <= 044ba9033c0b7fc04e8597536aa2367aaef14ae164f9ef39789e1a9418b52615499a146c0221ce7248e4a885f4d966e1e4cb29bcf0aa71f1557bfde07b01e785189000
      `),
    );

    const elf = new Elf(transport);
    const result = await elf.getAddress(DERIVATION_PATH);

    expect(result).toEqual({
      address: "qC9LpZnZ1CPzkEQPLjosdtb5DJaSjGg5eTrq738Dbi49HYDev",
      publicKey:
        "044ba9033c0b7fc04e8597536aa2367aaef14ae164f9ef39789e1a9418b52615499a146c0221ce7248e4a885f4d966e1e4cb29bcf0aa71f1557bfde07b01e78518",
    });
  });

  test("getAddress with display", async () => {
    const transport = await openTransportReplayer(
      RecordStore.fromString(`
      => e002010015058000002c80000650800000008000000000000000
      <= 044ba9033c0b7fc04e8597536aa2367aaef14ae164f9ef39789e1a9418b52615499a146c0221ce7248e4a885f4d966e1e4cb29bcf0aa71f1557bfde07b01e785189000
      `),
    );

    const elf = new Elf(transport);
    const result = await elf.getAddress(DERIVATION_PATH, true);

    expect(result).toEqual({
      address: "qC9LpZnZ1CPzkEQPLjosdtb5DJaSjGg5eTrq738Dbi49HYDev",
      publicKey:
        "044ba9033c0b7fc04e8597536aa2367aaef14ae164f9ef39789e1a9418b52615499a146c0221ce7248e4a885f4d966e1e4cb29bcf0aa71f1557bfde07b01e78518",
    });
  });

  test("getAddress with chainCode", async () => {
    const transport = await openTransportReplayer(
      RecordStore.fromString(`
      => e002000015058000002c80000650800000008000000000000000
      <= 044ba9033c0b7fc04e8597536aa2367aaef14ae164f9ef39789e1a9418b52615499a146c0221ce7248e4a885f4d966e1e4cb29bcf0aa71f1557bfde07b01e785189000
      `),
    );

    const elf = new Elf(transport);
    const result = await elf.getAddress(DERIVATION_PATH, false, true);

    expect(result).toEqual({
      address: "qC9LpZnZ1CPzkEQPLjosdtb5DJaSjGg5eTrq738Dbi49HYDev",
      publicKey:
        "044ba9033c0b7fc04e8597536aa2367aaef14ae164f9ef39789e1a9418b52615499a146c0221ce7248e4a885f4d966e1e4cb29bcf0aa71f1557bfde07b01e78518",
      chainCode: "9000",
    });
  });

  test("signTransaction", async () => {
    const transport = await openTransportReplayer(
      RecordStore.fromString(`
      => e0030100b101058000002c800006508000000080000000000000000a220a20d736f33c7c2a35a04603fd3e94d5395c29edd9ac159bed03e366c8fb700b7d1812220a202791e992a57f28e75a11f13af2c0aec8b0eb35d2f048d42eba8901c92e0378dc18b2fbe054220475e754232a085472616e73666572323c0a220a204ff4e63ad4aa7ec92e65ba2d37b2c56b3f82390bfc25e66cebab6821f3b05c0b1203454c461880d4dbd20f220b612074657374206d656d6f
      <= 5e4bff058f083935f665bcb6419f918aef5c87fa0aedbd3f51343173d1ca9aad7b2d81e5403ee0a693f6d0900cca08cda8a363b4a88ad537ada0047f32e86231009000
      `),
    );

    const elf = new Elf(transport);
    const result = await elf.signTransaction(
      DERIVATION_PATH,
      "0a220a20d736f33c7c2a35a04603fd3e94d5395c29edd9ac159bed03e366c8fb700b7d1812220a202791e992a57f28e75a11f13af2c0aec8b0eb35d2f048d42eba8901c92e0378dc18b2fbe054220475e754232a085472616e73666572323c0a220a204ff4e63ad4aa7ec92e65ba2d37b2c56b3f82390bfc25e66cebab6821f3b05c0b1203454c461880d4dbd20f220b612074657374206d656d6f",
    );

    expect(result).toEqual({
      signature:
        "5e4bff058f083935f665bcb6419f918aef5c87fa0aedbd3f51343173d1ca9aad7b2d81e5403ee0a693f6d0900cca08cda8a363b4a88ad537ada0047f32e8623100",
      chainCode: "9000",
    });
  });
});
