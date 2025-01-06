---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import Admonition from '@theme/Admonition';

# Web3DB: Intro

Web3DB is a **decentralized database engine** that revolutionizes data management by empowering users with unprecedented control over their information. This groundbreaking solution represents a paradigm shift in database design and operation, leveraging cutting-edge decentralized technologies and innovative access control methodologies to deliver unparalleled data security, scalability, and user sovereignty.

<Admonition type="info" title="Architecture Overview">
  Our decentralized database engine is built upon robust: data storage (IPFS), Smart Contract (Blockchain) based access control, distributed query engine (Spark) that seamlessly integrates a high-performance Python APIs with lots of others sophisticated technology stacks.
</Admonition>

## Project Overview

Our decentralized database engine is designed to enable efficient, real-time communication between the user interface and the underlying data storage and retrieval mechanisms, ensuring optimal performance and reliability.

<Tabs>

 <TabItem value="ui-layer" label="User Interface (UI)">
    UI is the front door for multiple users who can interact with Web3DB simultaneously via a web-based or command-line interface. The UI facilitates
    SQL query submission, allowing users to either input raw SQL queries or use form data. Upon submitting the query,
    the backend automatically resolves the appropriate state hash. Users can manage other features such as data sharing and access control via the UI. Additionally, it will contain sophisticated documentation, tutorials and other useful information.

  </TabItem>
  <TabItem value="api-layer" label="API Layer (Python)">
    The API layer, developed using Python FastAPI framework, serves as the critical communication gateway between the frontend and the backend. This layer is meticulously designed to handle incoming requests and queries with exceptional efficiency, leveraging advanced algorithms and data structures to process client requests.

    The API server is the central component for orchestrating the entire query flow. It retrieves the latest state hash for
    a given user and table from the smart contract. The server manages data retrieval and updates from IPFS.
    Additionally, it distributes queries to the Apache Spark cluster for execution. It retrieves the hashes for each data
    partition, distributes them to the Spark cluster while submitting queries, and partitions data before uploading it to
    IPFS.
    <Admonition type="note" title="Key Features">
      - Asynchronous request handling
      - Fine-grained access control (via Smart Contract)
      - Distributed query management (via Apache Spark)
      - Robust error handling
      - Scalable architecture
    </Admonition>

    By acting as a highly optimized pass-through connection, the API layer ensures fluid and responsive data exchange, providing a solid foundation for the decentralized database engine.

  </TabItem>

  <TabItem value="acl-layer" label="Access Control Layer">
    A blockchain-based smart contract layer validates user identities and enforces fine-grained access control policies. It
    ensures that only authorized users can access or modify their data. This is achieved using cryptographic mechanisms
    such as Attribute-Based Encryption (ABE) to safeguard data. Data will be encrypted using Advanced Encryption
    Standard (AES), and the secret key will be shared with the intended users using ABE. The access policies will be stored
    in a smart contract/blockchain for enhanced transparency and trust.

  </TabItem>

  <TabItem value="database-layer" label="Database Layer">
    At the heart of our project lies a cutting-edge database technology stack that combines the power of distributed computing, big data processing, and decentralized storage. Our setup leverages industry-leading tools and platforms, including:

    - **Apache Spark**: Apache Spark is a distributed query engine that executes relational queries across multiple worker nodes. The Spark
    Master coordinates with workers to distribute and parallelize query execution, ensuring scalability and efficiency. After
    retrieving data from IPFS using the hash mappings (resolved by the API Server), Spark processes the queries and returns
    the results.
    - **IPFS (InterPlanetary File System)**: IPFS stores raw data files, tables, and partitions in a decentralized manner. In this architecture, it stores SQL dumps.
It ensures data availability and integrity using Content Identifiers (CIDs). The API Server/Spark Workers retrieve the
required data from IPFS using state hashes resolved from the smart contract.

    Our database technology stack is orchestrated using Docker Compose, which simplifies the deployment and management of multi-container applications.
  </TabItem>
</Tabs>

### Decentralization and User Data Ownership

Decentralization lies at the core of our database engine's philosophy, empowering users with true ownership and control over their data. By eliminating the need for a constantly running, centralized database instance, we mitigate the risks associated with single points of failure and data breaches.

<Admonition type="important">
  Our system leverages the immutability and versioning capabilities of IPFS to ensure the integrity and preservation of data history. Each query that modifies data results in the creation of a new hash, effectively capturing the changes made while maintaining a tamper-proof record of previous states.
</Admonition>

Through our decentralized architecture, users retain complete control over their data, with the ability to grant or revoke access permissions as they see fit. This paradigm shift in data ownership puts the power back in the hands of the users, fostering trust, privacy, and security in the digital landscape.

### Zero Trust Access Control

We are working to implement **zero-trust access control policy** into our system. This research aims to establish a secure, reliable framework for data access that eliminates the reliance on centralized authorities and traditional trust models.

By leveraging blockchain (smart contract) and advanced cryptographic techniques, such as ABE, multi-party computation and homomorphic encryption, we aim to create a decentralized access control system that enables fine-grained, dynamic permissions management without compromising data privacy or security.

## Getting Started

To dive deeper into our decentralized database engine and explore its capabilities, please refer to the following sections of our documentation:

- [API Layer Architecture](./query-api)
- [Smart Contract](./query-api)
- [Decentralized Storage and Distributed Query Engine](./query-api)
- [Privacy and Data Ownership](./query-api)
- [Research and Development](./query-api)

We invite you to join us on this transformative journey as we redefine the landscape of database technology and champion the cause of user data sovereignty. Together, we will unlock the true potential of decentralized systems and pave the way for a more secure, transparent, and empowering digital future.
