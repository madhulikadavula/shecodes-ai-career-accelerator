import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Opportunity {
    id: bigint;
    title: string;
    jobType: JobType;
    skill: string;
    company: string;
    applicationLink: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum JobType {
    internship = "internship",
    fullTime = "fullTime"
}
export interface backendInterface {
    askAIRaw(apiKey: string, question: string, context: string): Promise<string>;
    generateContestRaw(apiKey: string): Promise<string>;
    generatePracticeRaw(apiKey: string, topic: string): Promise<string>;
    generatePrepPlanRaw(apiKey: string, role: string): Promise<string>;
    getOpportunities(): Promise<Array<Opportunity>>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
