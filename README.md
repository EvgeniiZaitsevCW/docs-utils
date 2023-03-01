# Docs Utilities

## Description
The set of scripts to use during documentation development of smart contracts.

The operations that can be done using these utilities:
1.  Normalize all addresses in a file, like `0xaabbccddeeff11223344556677889900abcdefff` => `0xaabBcCddEeff11223344556677889900ABCDefff`.

    In the result a new file with normalize addresses will be created with the path: `<initial_file_path>.fixed`.

    E.g. the initial `/home/me/README.md` file will be corrected and saved as `/home/me/README.md.fixed`. 

2.  Categorize all addresses from a file by creating a text file with two lists: contracts and EOA (external owned accounts), like:
    ```
    Contracts:
    0x0000000000000000000000000000000000000001
    0x0000000000000000000000000000000000000002

    EOAs:
    0x0000000000000000000000000000000000000003
    0x0000000000000000000000000000000000000004
    ```
    Into the `Contracts` section will be put all addresses that are in the [data/contracts.txt](data/contracts.txt).
    All other addresses will be put into the `EOAs` section.

    The path to the newly created file is `<initial_file_path>.addresses`. 

    E.g. the initial `/home/me/README.md` file will be corrected and saved as `/home/me/README.md.addresses`.

## Steps to run
1. Be sure you have NodeJS (at least version 14) and NPM (at leat version 6.14) are installed by running:
   ```bash
   node --version
   npm --version
   ```

2. Run the installation of dependencies and a [patch](https://github.com/NomicFoundation/hardhat/issues/2395#issuecomment-1043838164) of the Hardhat lib (from the root repository directory): 
   ```bash
   npm install
   ```

3. To normalize addresses in a file run:
   ```bash
   npm run normalize_addresses <file_path>
   ```

4. To categorize addresses in a file:
   * put all known contract addresses in the [data/contracts.txt](data/contracts.txt) file, be sure the last line is empty;
   * then run:
   ```bash
   npm run categorize_addresses <file_path>
   ```