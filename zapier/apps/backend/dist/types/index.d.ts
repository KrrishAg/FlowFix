import z from "zod";
export declare const signupSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, z.z.core.$strip>;
export declare const signinSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.z.core.$strip>;
export declare const zapCreateSchema: z.ZodObject<{
    availableTriggerId: z.ZodString;
    triggerMetaData: z.ZodOptional<z.ZodAny>;
    actions: z.ZodArray<z.ZodObject<{
        availableActionId: z.ZodString;
        actionMetaData: z.ZodOptional<z.ZodAny>;
    }, z.z.core.$strip>>;
}, z.z.core.$strip>;
//# sourceMappingURL=index.d.ts.map