# Praetorian
Blockchain base identity management system.

## Concept
It is impossible to know for certain that someone is who they say they are. There is a certain likelihood based on identification criteria on which we can assume a person’s identity. These identification criteria can be official documents, a historical record, biometrics, secrets a person knows and a web of trust identifying the person, to name a few. None of the methods to check on these criteria is fool proof. This poses a security problem in cases where a person’s identity is the legitimizes performing tasks.

In blockchain identity is managed using private and public key pairs. The private key is in that sense the avatar of a person’s identity. This is from the perspective of the blockchain the most secure method of identification. However good handling of the private key is crucial. It needs to be stored in a safe location, preferably locally on a device fully in control of the owner. This makes it a challenge to use a private key from multiple devices, furthermore losing the private key means losing access to identity controlled data. 

Currently, proposed solutions for the private key challenge are the use of a web of trust (uport) or having multiple private keys linked to your persona. We propose a more generic approach to linking a person’s identity to a private key. The first observation we would like to make is that different identification methods differ in the level  of certainty they provide about a person’s identity. So a persona identified with a password is less strong, than a persona identified with a fingerprint and a persona identified with both a fingerprint and a password is stronger than both methods separate. Based on this principle we have build an identity/ access management system in a smart contract blockchain.

The idea is that a person solves a number of challenges from a device that has generated a private key. Each challenge solved increases the likelihood that the private key generated represents the person. Based on the authority acquired by the private key, the key may/  may not execute tasks. 

In this manner private keys can be stored on devices making their storage as secure as possible. Security of authentication may not be as strong as possible, but the great advantage is that the usability of private public key pairs increases and becomes attractive for a larger public. Further inventions in handling private keys may improve the authentication mechanisms proposed by us and can easily build upon the ideas presented here.

We believe that our invention will inevitably lead to a transparent internet and world peace.

## Digital proof of identity
In the current world there are different ways to digital identify your self. Some means of authentication are stronger than others. By making combinations of different means the level of authentication can be increased. But as stated above it is very hard to know for certain that someone is who they say they are. Below different ways to authenticate means are explained how they technicaly proof that you are you say you are.

### Password Proof
The proof assumes that you are the only person that knows a certain combination of characters. This string is stored into a data store and compared at the moment of authentication. When the result matches the proof is successful.

### Oauth Proof
With the oauth proof you show that you have an account at an other service provider. Without sharing your credentials with the third party you make sure you are the owner of an account. This relays on the fact that the provider will only redirect you to a certain domain when you successfully authenticate yourself.

### Email Proof
In the email proof you show you are the one that has access to an certain mailbox. The provider sends an email with a link. When you open the link you proof that you have access to this mailbox.

### Biometric proof
The biometric proof measures characteristics of the human body and stores this as a profile in a data store. Metrics are measured with a device. During authentication the same profile will be created and compared with the profile in the datastore. When ther is a match the authentication was successful.

