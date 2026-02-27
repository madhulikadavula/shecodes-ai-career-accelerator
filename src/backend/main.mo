import Text "mo:core/Text";
import Array "mo:core/Array";
import OutCall "http-outcalls/outcall";

actor {
  public type Opportunity = {
    id : Nat;
    title : Text;
    company : Text;
    skill : Text;
    applicationLink : Text;
    jobType : JobType;
  };

  public type JobType = {
    #internship;
    #fullTime;
  };

  let opportunities : [Opportunity] = [
    /* JavaScript */
    {
      id = 1;
      title = "Frontend Developer Intern";
      company = "InnovateTech";
      skill = "JavaScript";
      applicationLink = "https://innovatech.com/apply";
      jobType = #internship;
    },
    {
      id = 2;
      title = "Junior JS Developer";
      company = "WebSolutions";
      skill = "JavaScript";
      applicationLink = "https://websolutions.com/careers";
      jobType = #fullTime;
    },
    {
      id = 3;
      title = "React Native Intern";
      company = "AppWorks";
      skill = "JavaScript";
      applicationLink = "https://appworks.com/jobs";
      jobType = #internship;
    },
    /* Python */
    {
      id = 4;
      title = "Data Analyst Intern";
      company = "DataDive";
      skill = "Python";
      applicationLink = "https://datadive.com/careers";
      jobType = #internship;
    },
    {
      id = 5;
      title = "Backend Developer";
      company = "TechServe";
      skill = "Python";
      applicationLink = "https://techserve.com/jobs";
      jobType = #fullTime;
    },
    /* React */
    {
      id = 6;
      title = "React Developer";
      company = "CodeCraft";
      skill = "React";
      applicationLink = "https://codecraft.com/apply";
      jobType = #fullTime;
    },
    {
      id = 7;
      title = "UI Developer Intern";
      company = "SmartApps";
      skill = "React";
      applicationLink = "https://smartapps.com/careers";
      jobType = #internship;
    },
    /* Machine Learning */
    {
      id = 8;
      title = "ML Intern";
      company = "AI Innovations";
      skill = "Machine Learning";
      applicationLink = "https://aiinnovations.com/jobs";
      jobType = #internship;
    },
    {
      id = 9;
      title = "ML Engineer";
      company = "FutureTech";
      skill = "Machine Learning";
      applicationLink = "https://futuretech.com/careers";
      jobType = #fullTime;
    },
    /* SQL */
    {
      id = 10;
      title = "Database Intern";
      company = "DataMasters";
      skill = "SQL";
      applicationLink = "https://datamasters.com/apply";
      jobType = #internship;
    },
    {
      id = 11;
      title = "SQL Developer";
      company = "QueryTech";
      skill = "SQL";
      applicationLink = "https://querytech.com/jobs";
      jobType = #fullTime;
    },
    /* Cloud */
    {
      id = 12;
      title = "Cloud Intern";
      company = "CloudWave";
      skill = "Cloud";
      applicationLink = "https://cloudwave.com/careers";
      jobType = #internship;
    },
    {
      id = 13;
      title = "Cloud Engineer";
      company = "TechCloud";
      skill = "Cloud";
      applicationLink = "https://techcloud.com/apply";
      jobType = #fullTime;
    },
    /* DevOps */
    {
      id = 14;
      title = "DevOps Intern";
      company = "OpsGen";
      skill = "DevOps";
      applicationLink = "https://opsgen.com/jobs";
      jobType = #internship;
    },
    /* UI/UX */
    {
      id = 15;
      title = "UI/UX Intern";
      company = "DesignPro";
      skill = "UI/UX";
      applicationLink = "https://designpro.com/careers";
      jobType = #internship;
    },
    {
      id = 16;
      title = "UX Designer";
      company = "InnovateDesigns";
      skill = "UI/UX";
      applicationLink = "https://innovatedesigns.com/apply";
      jobType = #fullTime;
    },
    /* Java */
    {
      id = 17;
      title = "Java Developer Intern";
      company = "CodeStream";
      skill = "Java";
      applicationLink = "https://codestream.com/jobs";
      jobType = #internship;
    },
    {
      id = 18;
      title = "Backend Developer";
      company = "CoreApps";
      skill = "Java";
      applicationLink = "https://coreapps.com/careers";
      jobType = #fullTime;
    },
  ];

  // Returns all hardcoded opportunities
  public query ({ caller }) func getOpportunities() : async [Opportunity] {
    opportunities;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func postToGemini(apiKey : Text, body : Text) : async Text {
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # apiKey;
    let headers = [{ name = "Content-Type"; value = "application/json" }];
    await OutCall.httpPostRequest(url, headers, body, transform);
  };

  func buildGeminiBody(prompt : Text) : Text {
    "{\"contents\":[{\"parts\":[{\"text\":\"" # prompt # "\"}]}]}";
  };

  public shared ({ caller }) func generateContestRaw(apiKey : Text) : async Text {
    let prompt = "Generate a JSON object for a programming contest with exactly this structure: {\\\"wednesday\\\": [{\\\"title\\\": \\\"...\\\", \\\"difficulty\\\": \\\"Easy\\\", \\\"description\\\": \\\"...\\\"}, ...], \\\"sunday\\\": [...]}. Each array must have exactly 5 problems: 2 Easy, 2 Medium, 1 Hard. Problems should be real programming challenges. Return ONLY valid JSON, no markdown, no explanation.";
    let body = buildGeminiBody(prompt);
    await postToGemini(apiKey, body);
  };

  public shared ({ caller }) func askAIRaw(apiKey : Text, question : Text, context : Text) : async Text {
    let prompt = "Explain the following programming problem step by step and return a JSON object with a single field called 'explanation'. Here's the problem: " # question # " Here is some additional context: " # context;
    let body = buildGeminiBody(prompt);
    await postToGemini(apiKey, body);
  };

  public shared ({ caller }) func generatePrepPlanRaw(apiKey : Text, role : Text) : async Text {
    let prompt = "Create a JSON object for a 10-day interview preparation plan for the role of " # role #
    ". The structure should be: { \\\"role\\\": \\\"" # role # "\\\", \\\"requiredSkills\\\": [Text], \\\"hiringProcess\\\": [Text], \\\"questionTypes\\\": [Text], \\\"roadmap\\\": [{\\\"day\\\": Nat, \\\"title\\\": Text, \\\"tasks\\\": [Text]}] }. Include detailed tasks for each day. Return ONLY valid JSON, no markdown or explanation.";
    let body = buildGeminiBody(prompt);
    await postToGemini(apiKey, body);
  };

  public shared ({ caller }) func generatePracticeRaw(apiKey : Text, topic : Text) : async Text {
    let prompt = "Create a set of 5 multiple-choice questions for the topic: " # topic #
    ". Return a JSON object in this structure: {\\\"questions\\\": [{\\\"question\\\": Text, \\\"options\\\": [4*Text], \\\"correct\\\": Nat (0-3)]}}. Questions should test different aspects of the topic. Return ONLY valid JSON, no markdown, no explanation.";
    let body = buildGeminiBody(prompt);
    await postToGemini(apiKey, body);
  };
};
