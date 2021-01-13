if (process.env.RELEASE_MODE !== '1') {
	throw new Error('Run `npm run release` to publish the package');
}
