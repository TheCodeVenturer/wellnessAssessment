import {
	S3Client,
	ListObjectsV2Command,
	DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	imageUrl: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

const s3Client = new S3Client({
	region: "eu-north-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY || "",
		secretAccessKey: process.env.AWS_SECRET_KEY || "",
	},
});

async function getFilesInFolder(bucketName: string, folderPath: string) {
	try {
		const command = new ListObjectsV2Command({
			Bucket: bucketName,
			Prefix: folderPath,
		});

		const response = await s3Client.send(command);

		if (!response.Contents) {
			return [];
		}

		return response.Contents.map((item) => item.Key);
	} catch (error) {
		console.error("Error listing files:", error);
		throw error;
	}
}

async function deleteFile(bucketName: string, fileKeys: string[]) {
	try {
		const command = new DeleteObjectsCommand({
			Bucket: bucketName,
			Delete: {
				Objects: fileKeys.map((key) => ({ Key: key })),
			},
		});

		await s3Client.send(command);
		console.log(`File deleted successfully: ${fileKeys}`);
	} catch (error) {
		console.error("Error deleting file:", error);
		throw error;
	}
}

async function getUsedImageUrls() {
	try {
		const users = await User.find();
		return users.map((user) => user.imageUrl);
	} catch (error) {
		console.error("Error fetching image URLs:", error);
		throw error;
	}
}
async function main() {
	const bucketName = "thecodeventurer-assignment";
	const folderPath = "profiles/";

	try {
		const imageUrls = await getUsedImageUrls();
		const files = await getFilesInFolder(bucketName, folderPath);

		if (!files || files.length === 0) {
			console.log("No files found in the folder");
			return;
		}

		const validFiles = files.filter((file): file is string => !!file);

		const unusedFiles = validFiles.filter(
			(file) => !imageUrls.includes(file)
		);

		if (unusedFiles.length === 0) {
			console.log("No unused files found");
			return;
		}

		await deleteFile(bucketName, unusedFiles);
	} catch (error) {
		console.error("Error deleting unused images:", error);
	}
}

await main();
