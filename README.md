# Observable Entropy

This is a [Next.js](https://nextjs.org/) web front-end for the
[truestamp/observable-entropy](https://github.com/truestamp/observable-entropy)
project.

It will display the current time, as well as the key info from the latest
`entropy.json` file available.

## Example Usage

One example of usage would be to display this website in the background of a
video call, visible to all parties. A recording of the video call would then
have the current timestamp visible as well as the most current observable
entropy data. This would have the effect of proving that the video call is
taking place live, or was pre-recorded after the point in time when the entropy
being displayed was generated.

Anyone can independently cryptographically verify the entropy data, it's
timestamp, and validity.
