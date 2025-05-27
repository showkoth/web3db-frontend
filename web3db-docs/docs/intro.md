---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import Admonition from '@theme/Admonition';

# Web3DB: Intro

Web3DB is a **distributed database engine** that revolutionizes data management by empowering users with unprecedented control over their information. This groundbreaking solution represents a paradigm shift in database design and operation, leveraging cutting-edge decentralized technologies and innovative access control methodologies to deliver unparalleled data security, scalability, and user sovereignty.

<Admonition type="info" title="Architecture Overview">
  Our decentralized database engine is built upon robust: data storage (IPFS), Smart Contract (Blockchain) and TEE (Intel SGX) based access control, distributed query engine (Spark) that seamlessly integrates a high-performance Python APIs with lots of others sophisticated technology stacks.
</Admonition>

**If you are looking for the technical details or deployment instructions, please check our github repository [here](https://github.com/nd-dsp-lab/web3db-backend).**

## Project Overview

Our decentralized database engine is designed to enable efficient, real-time communication between the user interface and the underlying data storage and retrieval mechanisms, ensuring optimal performance and reliability.

<Tabs>

 <TabItem value="ui-layer" label="User Interface (UI)">
    UI is the front door for multiple users who can interact with Web3DB simultaneously via a web-based or command-line interface. The UI facilitates users to upload tabular data or submit sql queries. Upon submitting the query, the backend automatically resolves the appropriate state hash, fetch data from ipfs and return the query result to the client. Additionally, hte UI also contain sophisticated documentation, tutorials and other useful information.

  </TabItem>
  <TabItem value="api-layer" label="API Layer (Python)">
    The API layer, developed using Python FastAPI framework, serves as the critical communication gateway between the frontend and the backend. This layer is meticulously designed to handle incoming requests and queries with exceptional efficiency, leveraging advanced algorithms and data structures to process client requests.

    The API server is the central component for orchestrating the entire query flow. The server manages data retrieval and updates from IPFS.
    Additionally, it distributes queries to the Apache Spark cluster for execution. It retrieves the hashes for each data
    partition, distributes them to the Spark cluster while submitting queries, and partitions data before uploading it to
    IPFS.

    <Admonition type="note" title="Key Features">
      - Asynchronous request handling
      - SQL-enforced Fine-grained access control
      - Distributed Index Management for efficient data retrieval
      - Distributed query management (via Apache Spark)
      - Robust error handling
      - Scalable architecture
    </Admonition>

  </TabItem>

  <TabItem value="acl-layer" label="Access Control Layer">
    A blockchain (smart contract) layer validates user identities and enforces sql based fine-grained access control via TEE (Intel SGX). It
    ensures that only authorized users can access their data. This is achieved by applying various cryptographic mechanisms. Data will be encrypted by SGX, and can only be decrypted by SGX.

  </TabItem>

  <TabItem value="database-layer" label="Database Layer">
    At the heart of our project lies a cutting-edge database technology stack that combines the power of distributed computing, big data processing, and decentralized storage. Our setup leverages industry-leading tools and platforms, including:

    - **Apache Spark**: Apache Spark is a distributed query engine that executes relational queries across multiple worker nodes. The Spark
    Master coordinates with workers to distribute and parallelize query execution, ensuring scalability and efficiency. After
    retrieving data from IPFS using our index, Spark processes the queries and returns the results.
    - **IPFS (InterPlanetary File System)**: IPFS stores raw data files in a storage efficient format (parquet) and partitions in a decentralized manner.

It ensures data availability and integrity using Content Identifiers (CIDs). The API Server/Spark Workers retrieve the
required data from IPFS using appropriate CIDs returned by web3db index.

    Our database technology stack is orchestrated using Docker Compose, which simplifies the deployment and management of multi-container applications.

  </TabItem>
</Tabs>

### Decentralization and User Data Ownership

Decentralization lies at the core of our database engine's philosophy, empowering users with true ownership and control over their data. By eliminating the need for a constantly running, centralized database instance, we mitigate the risks associated with single points of failure and data breaches. Through our decentralized architecture, users retain complete control over their data, with the ability to grant or revoke access permissions according to their requirement. This paradigm shift in data ownership puts the power back in the hands of the users, fostering trust, privacy, and security in the digital landscape.

### Zero Trust Access Control

We are working to implement **zero-trust access control policy** into our system. This research aims to establish a secure, reliable framework for data access that eliminates the reliance on centralized authorities and traditional trust models. By leveraging blockchain (smart contract) and TEE, we aim to create a decentralized access control system that enables fine-grained, dynamic permissions management without compromising data privacy or security.

## Getting Started

To dive deeper into our decentralized database engine and explore its capabilities, please refer to the following sections of our documentation:

- [API Layer](./api-layer)
- [Decentralized Storage and Distributed Query Engine](./DB%20Layer)
- [Access Control](./smart-contract)

We invite you to join us on this transformative journey as we redefine the landscape of database technology and champion the cause of user data sovereignty. Together, we will unlock the true potential of decentralized systems and pave the way for a more secure, transparent, and empowering digital future.
