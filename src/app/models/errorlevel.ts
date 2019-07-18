export class ErrorCorrectionLevel{

	static forBits( bits:any)
	{
		if (bits < 0 || bits >= this.FOR_BITS.length)
		{
			throw "ArgumentException";
		}
		return this.FOR_BITS[bits];
	}

	static L = new ErrorCorrectionLevel(0, 0x01, "L");
	static M = new ErrorCorrectionLevel(1, 0x00, "M");
	static Q = new ErrorCorrectionLevel(2, 0x03, "Q");
	static H = new ErrorCorrectionLevel(3, 0x02, "H");
	static FOR_BITS = new Array( ErrorCorrectionLevel.M, ErrorCorrectionLevel.L, ErrorCorrectionLevel.H, ErrorCorrectionLevel.Q);


	ordinal_Renamed_Field:any;
	bits:any;
	name:any;
	constructor(ordinal:any ,  bits:any, name:any){

		this.ordinal_Renamed_Field = ordinal;
		this.bits = bits;
		this.name = name;
	}

	get Bits()
	{
		return this.bits;
	};
	get Name()
	{
		return this.name;
	};
	ordinal()
	{
		return this.ordinal_Renamed_Field;
	}

}